import sys
import subprocess
import webbrowser
import requests
from PyQt5.QtWidgets import (QApplication, QWidget, QVBoxLayout, QTabWidget, QLineEdit, QPushButton, QLabel, QTextEdit,
                             QComboBox, QFileDialog, QMessageBox)
from PyQt5.QtCore import Qt
from PyQt5.QtGui import QIcon, QPalette, QColor
import dns.resolver
from bs4 import BeautifulSoup
import re
import validators
from urllib.parse import urljoin

# Expanded common subdomains for bruteforce
common_subdomains = [
    "www", "mail", "api", "ftp", "dev", "blog", "shop", "secure", "test", "staging",
    "m", "webmail", "portal", "admin", "support", "intranet", "vpn", "static", "cdn", "app",
    "demo", "local", "home", "service", "my", "news", "forum", "docs"
]

# Function to perform DNS resolution with length validation
def dns_query(domain):
    subdomains = []
    
    # Check for domain length (DNS allows a maximum of 255 characters)
    if len(domain) > 253:
        print(f"Skipping invalid domain (too long): {domain}")
        return subdomains
    
    try:
        # Resolve A record for subdomains
        result = dns.resolver.resolve(domain, 'A')
        for ipval in result:
            subdomains.append(ipval.to_text())
    except (dns.resolver.NoAnswer, dns.resolver.NXDOMAIN):
        pass
    except Exception as e:
        print(f"Error resolving {domain}: {e}")
    
    return subdomains

# Function to find subdomains using crt.sh API
def find_subdomains_crtsh(domain):
    url = f"https://crt.sh/?q=%25.{domain}&output=json"
    response = requests.get(url)
    subdomains = set()

    if response.status_code == 200:
        data = response.json()
        for entry in data:
            subdomains.add(entry['name_value'])
    
    return subdomains

# Function to perform bruteforce on common subdomains
def bruteforce_subdomains(domain):
    subdomains = []
    for subdomain in common_subdomains:
        full_domain = f"{subdomain}.{domain}"
        # Only query valid subdomains (check DNS before querying)
        if dns_query(full_domain):
            subdomains.append(full_domain)
    return subdomains

# Function to perform Google search for subdomains and safely extract them
def find_subdomains_google(domain):
    search_url = f"https://www.google.com/search?q=site:{domain}+subdomain"
    headers = {
        'User -Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    }
    response = requests.get(search_url, headers=headers)
    subdomains = set()
    
    if response.status_code == 200:
        soup = BeautifulSoup(response.text, 'html.parser')
        links = soup.find_all('a', href=True)
        
        for link in links:
            href = link['href']
            # Using regex to safely extract domain from URLs
            match = re.search(r'https?://([a-zA-Z0-9-]+\.[a-zA-Z]{2,})', href)
            if match:
                found_subdomain = match.group(1)
                if found_subdomain != domain and found_subdomain.endswith(domain):
                    subdomains.add(found_subdomain)
    
    return subdomains

# Function to aggregate all subdomains from different sources
def find_all_subdomains(domain):
    print(f"Finding subdomains for {domain}...")
    
    subdomains = set()

    # Step 1: Bruteforce common subdomains
    subdomains.update(bruteforce_subdomains(domain))
    
    # Step 2: Get subdomains from crt.sh (SSL certificates)
    subdomains.update(find_subdomains_crtsh(domain))
    
    # Step 3: Try Google search for subdomains (as an additional passive source)
    subdomains.update(find_subdomains_google(domain))
    
    # Step 4: Validate subdomains with DNS resolution
    valid_subdomains = set()
    for sub in subdomains:
        if dns_query(sub):
            valid_subdomains.add(sub)
    
    return valid_subdomains

# Function to extract JavaScript files
def extract_js_files(url):
    try:
        if not validators.url(url):
            raise ValueError("Invalid URL format.")
        
        response = requests.get(url, timeout=10)
        response.raise_for_status()
        
        soup = BeautifulSoup(response.text, 'html.parser')
        
        scripts = soup.find_all('script')
        js_files = []

        for script in scripts:
            if script.get('src'):
                # Use urljoin to handle relative URLs
                js_url = urljoin(url, script['src'])
                js_files.append(js_url)
        
        return js_files

    except ValueError as ve:
        QMessageBox.critical(None, "URL Error", str(ve))
        return []
    except requests.exceptions.RequestException as e:
        QMessageBox.critical(None, "Request Error", f"An error occurred: {e}")
        return []

# Function to save results to a file
def save_results(results_text):
    content = results_text.toPlainText().strip()
    if not content:
        QMessageBox.warning(None, "No Content", "No data to save!")
        return
    
    file_path, _ = QFileDialog.getSaveFileName(None, "Save Results", "", "Text Files (*.txt)")
    if file_path:
        try:
            with open(file_path, 'w') as file:
                file.write(content)
            QMessageBox.information(None, "Success", "Results saved successfully!")
        except Exception as e:
            QMessageBox.critical(None, "Error", f"Could not save file: {e}")

# Function triggered on Extract JavaScript button click
def on_extract_click(url_entry, results_box_js):
    target_url = url_entry.text()
    if not target_url.strip():
        QMessageBox.warning(None, "Input Error", "Please enter a valid URL.")
        return

    results_box_js.clear()

    js_files = extract_js_files(target_url)
    if js_files:
        results_box_js.append(f"Found {len(js_files)} JavaScript files:\n")
        for js in js_files:
            results_box_js.append(js)
    else:
        results_box_js.append("No JavaScript files found.")

# Function to check and install Nmap
def install_nmap():
    try:
        if subprocess.run(["nmap", "--version"], capture_output=True, text=True).returncode == 0:
            QMessageBox.information(None, "Nmap Installation", "Nmap is already installed.")
            return
    except FileNotFoundError:
        pass

    download_url = "https://nmap.org/download.html"
    response = QMessageBox.question(None, "Nmap Installation", "Nmap is not installed. Would you like to open the download page?", QMessageBox.Yes | QMessageBox.No)
    if response == QMessageBox.Yes:
        webbrowser.open(download_url)

# Function to run Nmap scan
def run_scan(target, scan_type, results_box_nmap):
    if not target:
        QMessageBox.critical(None, "Input Error", "Please enter a target IP or hostname.")
        return

    if not scan_type:
        QMessageBox.critical(None, "Input Error", "Please select a scan type.")
        return

    scan_command = {
        "Ping Scan": "-sn",
        "Quick Scan": "-T4",
        "Full Scan": "-sS",
        "Service Scan": "-sV",
        "OS Detection": "-O"
    }.get(scan_type, "")

    try:
        result = subprocess.run(["nmap", scan_command, target], capture_output=True, text=True)
        results_box_nmap.clear()
        if result.returncode == 0:
            results_box_nmap.append(result.stdout)
        else:
            results_box_nmap.append(f"Error: {result.stderr}")
    except FileNotFoundError:
        QMessageBox.critical(None, "Error", "Nmap is not installed. Click 'Install Nmap' to install it.")

# Function to bruteforce subdomains with a custom wordlist
def bruteforce_custom_subdomains(domain, wordlist):
    subdomains = []
    try:
        with open(wordlist, 'r') as file:
            for line in file:
                subdomain = line.strip()
                if subdomain:
                    full_domain = f"{subdomain}.{domain}"
                    if dns_query(full_domain):
                        subdomains.append(full_domain)
    except Exception as e:
        QMessageBox.critical(None, "Error", f"Could not read wordlist: {e}")
    return subdomains

# Main PyQt5 Application
class MultiToolGUI(QWidget):
    def __init__(self):
        super().__init__()
        self.setWindowTitle("Multi-Tool GUI")
        self.setGeometry(100, 100, 800, 600)
        self.setWindowIcon(QIcon("icon.png"))  

        palette = QPalette()
        palette.setColor(QPalette.Background, QColor(240, 248, 255))
        self.setPalette(palette)

        self.tabs = QTabWidget(self)
        self.tabs.setStyleSheet("QTabWidget::pane { border: 1px solid #ccc; border-radius: 4px; }")

        # JavaScript Extractor Tab
        self.tab_js = QWidget()
        self.tabs.addTab(self.tab_js, "JavaScript Extractor")
        self.init_js_tab()

        # Nmap Scanner Tab
        self.tab_nmap = QWidget()
        self.tabs.addTab(self.tab_nmap, "Nmap Scanner")
        self.init_nmap_tab()

        # Subdomain Finder Tab
        self.tab_subdomain = QWidget()
        self.tabs.addTab(self.tab_subdomain, "Subdomain Finder")
        self.init_subdomain_tab()

        # Custom Wordlist Brute Force Tab
        self.tab_bruteforce = QWidget()
        self.tabs.addTab(self.tab_bruteforce, "Brute Force Subdomains")
        self.init_bruteforce_tab()

        # Set layout for the main window
        main_layout = QVBoxLayout(self)
        main_layout.addWidget(self.tabs)

    def init_js_tab(self):
        layout = QVBoxLayout(self.tab_js)
        self.url_entry = QLineEdit(self.tab_js)
        self.url_entry.setPlaceholderText("Enter URL")
        layout.addWidget(self.url_entry)

        extract_button = QPushButton("Extract JavaScript Files", self.tab_js)
        extract_button.clicked.connect(lambda: on_extract_click(self.url_entry, self.results_box_js))
        layout.addWidget(extract_button)

        save_button = QPushButton("Save Results", self.tab_js)
        save_button.clicked.connect(lambda: save_results(self.results_box_js))
        layout.addWidget(save_button)

        self.results_box_js = QTextEdit(self.tab_js)
        self.results_box_js.setReadOnly(True)
        layout.addWidget(self.results_box_js)

    def init_nmap_tab(self):
        layout = QVBoxLayout(self.tab_nmap)

        self.target_entry = QLineEdit(self.tab_nmap)
        self.target_entry.setPlaceholderText("Enter Target (IP/Hostname)")
        layout.addWidget(self.target_entry)

        self.scan_type_combo = QComboBox(self.tab_nmap)
        self.scan_type_combo.addItems(["Ping Scan", "Quick Scan", "Full Scan", "Service Scan", "OS Detection"])
        layout.addWidget(self.scan_type_combo)

        scan_button = QPushButton("Run Scan", self.tab_nmap)
        scan_button.clicked.connect(lambda: run_scan(self.target_entry.text(), self.scan_type_combo.currentText(), self.results_box_nmap))
        layout.addWidget(scan_button)

        install_button = QPushButton("Install Nmap", self.tab_nmap)
        install_button.clicked.connect(install_nmap)
        layout.addWidget(install_button)

        self.results_box_nmap = QTextEdit(self.tab_nmap)
        self.results_box_nmap.setReadOnly(True)
        layout.addWidget(self.results_box_nmap)

    def init_subdomain_tab(self):
        layout = QVBoxLayout(self.tab_subdomain)

        self.domain_entry = QLineEdit(self.tab_subdomain)
        self.domain_entry.setPlaceholderText("Enter Domain")
        layout.addWidget(self.domain_entry)

        find_button = QPushButton("Find Subdomains", self.tab_subdomain)
        find_button.clicked.connect(self.find_subdomains)
        layout.addWidget(find_button)

        self.results_box_subdomains = QTextEdit(self.tab_subdomain)
        self.results_box_subdomains.setReadOnly(True)
        layout.addWidget(self.results_box_subdomains)

    def init_bruteforce_tab(self):
        layout = QVBoxLayout(self.tab_bruteforce)

        self.domain_entry_bf = QLineEdit(self.tab_bruteforce)
        self.domain_entry_bf.setPlaceholderText("Enter Domain")
        layout.addWidget(self.domain_entry_bf)

        self.wordlist_button = QPushButton("Select Wordlist", self.tab_bruteforce)
        self.wordlist_button.clicked.connect(self.select_wordlist)
        layout.addWidget(self.wordlist_button)

        self.wordlist_label = QLabel("No wordlist selected", self.tab_bruteforce)
        layout.addWidget(self.wordlist_label)

        self.bruteforce_button = QPushButton("Bruteforce Subdomains", self.tab_bruteforce)
        self.bruteforce_button.clicked.connect(self.bruteforce_subdomains)
        layout.addWidget(self.bruteforce_button)

        self.results_box_bruteforce = QTextEdit(self.tab_bruteforce)
        self.results_box_bruteforce.setReadOnly(True)
        layout.addWidget(self.results_box_bruteforce)

        self.wordlist_path = ""

    def select_wordlist(self):
        file_path, _ = QFileDialog.getOpenFileName(self, "Select Wordlist", "", "Text Files (*.txt);;All Files (*)")
        if file_path:
            self.wordlist_path = file_path
            self.wordlist_label.setText(f"Selected: {file_path}")

    def bruteforce_subdomains(self):
        domain = self.domain_entry_bf.text()
        if not domain.strip():
            QMessageBox.warning(None, "Input Error", "Please enter a valid domain.")
            return
        
        if not self.wordlist_path:
            QMessageBox.warning(None, "Input Error", "Please select a wordlist.")
            return
        
        self.results_box_bruteforce.clear()

        subdomains = bruteforce_custom_subdomains(domain, self.wordlist_path)

        if subdomains:
            self.results_box_bruteforce.append(f"Found {len(subdomains)} subdomains for {domain}:\n")
            for sub in subdomains:
                self.results_box_bruteforce.append(sub)
        else:
            self.results_box_bruteforce.append(f"No subdomains found for {domain}.")

    def find_subdomains(self):
        domain = self.domain_entry.text()
        if not domain.strip():
            QMessageBox.warning(None, "Input Error", "Please enter a valid domain.")
            return
        
        self.results_box_subdomains.clear()

        try:
            subdomains = find_all_subdomains(domain)

            if subdomains:
                self.results_box_subdomains.append(f"Found {len(subdomains)} subdomains for {domain}:\n")
                for sub in subdomains:
                    self.results_box_subdomains.append(sub)
            else:
                self.results_box_subdomains.append(f"No subdomains found for {domain}.")
        except Exception as e:
            QMessageBox.critical(None, "Error", f"An error occurred while finding subdomains: {e}")

if __name__ == '__main__':
    app = QApplication(sys.argv)
    window = MultiToolGUI()
    window.show()
    sys.exit(app.exec_())