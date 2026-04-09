import socket
import threading

# Function to scan a specific port
def scan_port(target, port):
    try:
        with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as sock:
            sock.settimeout(1)  # Timeout for each connection attempt
            result = sock.connect_ex((target, port))
            if result == 0:
                print(f"[+] Port {port} is open.")
    except Exception as e:
        print(f"[-] Error scanning port {port}: {e}")

# Function to scan a range of ports
def scan_target(target, start_port, end_port):
    print(f"Starting scan on target: {target}")
    for port in range(start_port, end_port + 1):
        thread = threading.Thread(target=scan_port, args=(target, port))
        thread.start()

# Main function
if __name__ == "__main__":
    target = input("Enter target IP or hostname: ")
    try:
        target_ip = socket.gethostbyname(target)
        print(f"Resolved target {target} to IP: {target_ip}")
    except socket.gaierror:
        print("Error: Unable to resolve target.")
        exit()

    start_port = int(input("Enter starting port: "))
    end_port = int(input("Enter ending port: "))

    scan_target(target_ip, start_port, end_port)
