import time
import requests
import datetime
import sys

# URL to keep alive
TARGET_URL = "https://gocart-main-4.onrender.com/health"
# Interval in seconds (5 minutes = 300 seconds)
PING_INTERVAL = 300

print("==================================================")
print("🚀 GoCart Render Backend Keep-Alive Pinger starting")
print(f"Target URL: {TARGET_URL}")
print(f"Interval:   {PING_INTERVAL} seconds (5 minutes)")
print("==================================================")

try:
    while True:
        timestamp = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        try:
            start_time = time.time()
            response = requests.get(TARGET_URL, timeout=30)
            elapsed_time = time.time() - start_time
            
            if response.status_code == 200:
                print(f"[{timestamp}] ✅ Ping successful! Status: {response.status_code} | Time: {elapsed_time:.2f}s")
            else:
                print(f"[{timestamp}] ⚠️ Ping returned status code: {response.status_code} | Time: {elapsed_time:.2f}s")
        except requests.exceptions.RequestException as e:
            print(f"[{timestamp}] ❌ Ping failed with error: {e}")
        
        sys.stdout.flush()
        time.sleep(PING_INTERVAL)
except KeyboardInterrupt:
    print("\n🛑 Keep-alive pinger stopped by user.")
