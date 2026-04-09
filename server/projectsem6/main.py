import tkinter as tk
from tkinter import ttk, messagebox, scrolledtext, filedialog
import requests
from bs4 import BeautifulSoup
from urllib.parse import urljoin
import validators  # For URL validation
import subprocess
import webbrowser

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
        messagebox.showerror("URL Error", str(ve))
        return []
    except requests.exceptions.RequestException as e:
        messagebox.showerror("Request Error", f"An error occurred: {e}")
        return []

# Function to save results to a file
def save_results():
    content = results_box_js.get("1.0", tk.END).strip()
    if not content:
        messagebox.showwarning("No Content", "No data to save!")
        return
    
    file_path = filedialog.asksaveasfilename(defaultextension=".txt", filetypes=[("Text Files", "*.txt")])
    if file_path:
        try:
            with open(file_path, 'w') as file:
                file.write(content)
            messagebox.showinfo("Success", "Results saved successfully!")
        except Exception as e:
            messagebox.showerror("Error", f"Could not save file: {e}")

# Function triggered on Extract JavaScript button click
def on_extract_click():
    target_url = url_entry.get()
    if not target_url.strip():
        messagebox.showwarning("Input Error", "Please enter a valid URL.")
        return

    results_box_js.delete("1.0", tk.END)  # Clear previous results

    js_files = extract_js_files(target_url)
    if js_files:
        results_box_js.insert(tk.END, f"Found {len(js_files)} JavaScript files:\n\n")
        for js in js_files:
            results_box_js.insert(tk.END, f"{js}\n")
    else:
        results_box_js.insert(tk.END, "No JavaScript files found.")

# Function to check and install Nmap
def install_nmap():
    try:
        if subprocess.run(["nmap", "--version"], capture_output=True, text=True).returncode == 0:
            messagebox.showinfo("Nmap Installation", "Nmap is already installed.")
            return
    except FileNotFoundError:
        pass

    # Provide guidance for manual installation on Windows
    download_url = "https://nmap.org/download.html"
    response = messagebox.askyesno("Nmap Installation", "Nmap is not installed. Would you like to open the download page?")
    if response:
        webbrowser.open(download_url)

# Function to run Nmap scan
def run_scan():
    target = entry_target.get()
    scan_type = combo_scan_type.get()

    if not target:
        messagebox.showerror("Input Error", "Please enter a target IP or hostname.")
        return

    if not scan_type:
        messagebox.showerror("Input Error", "Please select a scan type.")
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
        if result.returncode == 0:
            results_box_nmap.delete(1.0, tk.END)
            results_box_nmap.insert(tk.END, result.stdout)
        else:
            results_box_nmap.delete(1.0, tk.END)
            results_box_nmap.insert(tk.END, f"Error: {result.stderr}")
    except FileNotFoundError:
        messagebox.showerror("Error", "Nmap is not installed. Click 'Install Nmap' to install it.")

# Main GUI application
def main():
    root = tk.Tk()
    root.title("Multi-Tool GUI")
    root.geometry("800x600")

    # Tab Control
    tab_control = ttk.Notebook(root)

    # Tab 1: JavaScript Extractor
    tab_js = ttk.Frame(tab_control)
    tab_control.add(tab_js, text="JavaScript Extractor")

    tk.Label(tab_js, text="Enter URL:", font=("Arial", 12)).pack(pady=10)
    global url_entry
    url_entry = ttk.Entry(tab_js, width=60, font=("Arial", 12))
    url_entry.pack(pady=5)

    extract_button = ttk.Button(tab_js, text="Extract JavaScript Files", command=on_extract_click)
    extract_button.pack(pady=10)

    save_button = ttk.Button(tab_js, text="Save Results", command=save_results)
    save_button.pack(pady=5)

    global results_box_js
    results_box_js = scrolledtext.ScrolledText(tab_js, wrap=tk.WORD, width=80, height=20, font=("Arial", 10))
    results_box_js.pack(pady=10)

    # Tab 2: Nmap Scanner
    tab_nmap = ttk.Frame(tab_control)
    tab_control.add(tab_nmap, text="Nmap Scanner")

    frame_target = ttk.Frame(tab_nmap, padding="10")
    frame_target.pack(fill=tk.X)

    label_target = ttk.Label(frame_target, text="Target (IP/Hostname):")
    label_target.pack(side=tk.LEFT, padx=5)

    global entry_target
    entry_target = ttk.Entry(frame_target, width=50)
    entry_target.pack(side=tk.LEFT, padx=5)

    frame_scan_type = ttk.Frame(tab_nmap, padding="10")
    frame_scan_type.pack(fill=tk.X)

    label_scan_type = ttk.Label(frame_scan_type, text="Scan Type:")
    label_scan_type.pack(side=tk.LEFT, padx=5)

    global combo_scan_type
    combo_scan_type = ttk.Combobox(frame_scan_type, values=["Ping Scan", "Quick Scan", "Full Scan", "Service Scan", "OS Detection"], state="readonly")
    combo_scan_type.pack(side=tk.LEFT, padx=5)

    frame_buttons = ttk.Frame(tab_nmap, padding="10")
    frame_buttons.pack(fill=tk.X)

    button_run = ttk.Button(frame_buttons, text="Run Scan", command=run_scan)
    button_run.pack(side=tk.LEFT, padx=5)

    button_install = ttk.Button(frame_buttons, text="Install Nmap", command=install_nmap)
    button_install.pack(side=tk.LEFT, padx=5)

    global results_box_nmap
    results_box_nmap = scrolledtext.ScrolledText(tab_nmap, wrap=tk.WORD, width=80, height=20, font=("Arial", 10))
    results_box_nmap.pack(pady=10)

    tab_control.pack(expand=1, fill="both")

    root.mainloop()

if __name__ == "__main__":
    main()
