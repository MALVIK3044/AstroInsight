import sys
import subprocess
import webbrowser
import requests
from PyQt5.QtWidgets import (QApplication, QWidget, QVBoxLayout, QTabWidget, QLineEdit, QPushButton, QLabel, QTextEdit,
                             QComboBox, QFileDialog, QMessageBox, QHBoxLayout)
from PyQt5.QtCore import Qt
from PyQt5.QtGui import QIcon, QPalette, QColor, QFont
from bs4 import BeautifulSoup
from urllib.parse import urljoin
import validators  # For URL validation


# Function to extract JavaScript files
def extract_js_files(url):
    try:
        # Validate the URL format
        if not validators.url(url):
            raise ValueError("Invalid URL format.")
        
        # Fetch the webpage content
        response = requests.get(url, timeout=10)  # 10-second timeout
        response.raise_for_status()  # Raise an error for HTTP requests with bad status codes
        
        # Parse the HTML content
        soup = BeautifulSoup(response.text, 'html.parser')
        
        # Find all <script> tags
        scripts = soup.find_all('script')
        js_files = []

        for script in scripts:
            if script.get('src'):  # Check if 'src' attribute exists
                js_url = urljoin(url, script['src'])  # Handle relative URLs
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

    results_box_js.clear()  # Clear previous results

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

    # Provide guidance for manual installation on Windows
    download_url = "https://nmap.org/download.html"
    response = QMessageBox.question(None, "Nmap Installation", "Nmap is not installed. Would you like to open the download page?",
                                     QMessageBox.Yes | QMessageBox.No)
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


# Main PyQt5 Application
class MultiToolGUI(QWidget):
    def __init__(self):
        super().__init__()
        self.setWindowTitle("Multi-Tool GUI")
        self.setGeometry(100, 100, 800, 600)
        self.setWindowIcon(QIcon("icon.png"))  # Optional: Add a window icon

        # Set a colorful background palette
        palette = QPalette()
        palette.setColor(QPalette.Background, QColor(240, 248, 255))  # Light blue background
        self.setPalette(palette)

        # Create tab widget
        self.tabs = QTabWidget(self)
        self.tabs.setStyleSheet("QTabWidget::pane { border: 1px solid #ccc; border-radius: 4px; }")
        
        # Create the first tab: JavaScript Extractor
        self.tab_js = QWidget()
        self.tabs.addTab(self.tab_js, "JavaScript Extractor")
        self.init_js_tab()

        # Create the second tab: Nmap Scanner
        self.tab_nmap = QWidget()
        self.tabs.addTab(self.tab_nmap, "Nmap Scanner")
        self.init_nmap_tab()

        # Set layout for the main window
        main_layout = QVBoxLayout(self)
        main_layout.addWidget(self.tabs)

    def init_js_tab(self):
        layout = QVBoxLayout(self.tab_js)

        # Custom font and styling for the URL input
        self.url_entry = QLineEdit(self.tab_js)
        self.url_entry.setPlaceholderText("Enter URL")
        self.url_entry.setStyleSheet("QLineEdit { padding: 10px; font-size: 14px; border: 1px solid #ccc; border-radius: 5px; }")
        layout.addWidget(self.url_entry)

        # Button with color styling
        extract_button = QPushButton("Extract JavaScript Files", self.tab_js)
        extract_button.setStyleSheet("""
            QPushButton {
                background-color: #4CAF50;
                color: white;
                padding: 10px;
                border-radius: 5px;
                font-size: 14px;
            }
            QPushButton:hover {
                background-color: #45a049;
            }
        """)
        extract_button.clicked.connect(lambda: on_extract_click(self.url_entry, self.results_box_js))
        layout.addWidget(extract_button)

        save_button = QPushButton("Save Results", self.tab_js)
        save_button.setStyleSheet("""
            QPushButton {
                background-color: #008CBA;
                color: white;
                padding: 10px;
                border-radius: 5px;
                font-size: 14px;
            }
            QPushButton:hover {
                background-color: #007B9F;
            }
        """)
        save_button.clicked.connect(lambda: save_results(self.results_box_js))
        layout.addWidget(save_button)

        self.results_box_js = QTextEdit(self.tab_js)
        self.results_box_js.setReadOnly(True)
        self.results_box_js.setStyleSheet("QTextEdit { background-color: #f5f5f5; border: 1px solid #ccc; border-radius: 5px; font-size: 14px; padding: 10px; }")
        layout.addWidget(self.results_box_js)

    def init_nmap_tab(self):
        layout = QVBoxLayout(self.tab_nmap)

        self.target_entry = QLineEdit(self.tab_nmap)
        self.target_entry.setPlaceholderText("Enter Target (IP/Hostname)")
        self.target_entry.setStyleSheet("QLineEdit { padding: 10px; font-size: 14px; border: 1px solid #ccc; border-radius: 5px; }")
        layout.addWidget(self.target_entry)

        self.scan_type_combo = QComboBox(self.tab_nmap)
        self.scan_type_combo.addItems(["Ping Scan", "Quick Scan", "Full Scan", "Service Scan", "OS Detection"])
        self.scan_type_combo.setStyleSheet("QComboBox { padding: 10px; font-size: 14px; border-radius: 5px; }")
        layout.addWidget(self.scan_type_combo)

        scan_button = QPushButton("Run Scan", self.tab_nmap)
        scan_button.setStyleSheet("""
            QPushButton {
                background-color: #4CAF50;
                color: white;
                padding: 10px;
                border-radius: 5px;
                font-size: 14px;
            }
            QPushButton:hover {
                background-color: #45a049;
            }
        """)
        scan_button.clicked.connect(lambda: run_scan(self.target_entry.text(), self.scan_type_combo.currentText(), self.results_box_nmap))
        layout.addWidget(scan_button)

        install_button = QPushButton("Install Nmap", self.tab_nmap)
        install_button.setStyleSheet("""
            QPushButton {
                background-color: #FF5733;
                color: white;
                padding: 10px;
                border-radius: 5px;
                font-size: 14px;
            }
            QPushButton:hover {
                background-color: #FF4517;
            }
        """)
        install_button.clicked.connect(install_nmap)
        layout.addWidget(install_button)

        self.results_box_nmap = QTextEdit(self.tab_nmap)
        self.results_box_nmap.setReadOnly(True)
        self.results_box_nmap.setStyleSheet("QTextEdit { background-color: #f5f5f5; border: 1px solid #ccc; border-radius: 5px; font-size: 14px; padding: 10px; }")
        layout.addWidget(self.results_box_nmap)


if __name__ == '__main__':
    app = QApplication(sys.argv)
    window = MultiToolGUI()
    window.show()
    sys.exit(app.exec_())
