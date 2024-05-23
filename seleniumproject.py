import chromedriver_autoinstaller
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

# Install ChromeDriver if not installed
chromedriver_autoinstaller.install()

# Set up WebDriver options
options = Options()
# options.add_argument('--headless')  # Run headless browser
# options.add_argument('--disable-gpu')  # Disable GPU acceleration
# options.add_argument('--no-sandbox')  # Required for Docker
# options.add_argument('--disable-dev-shm-usage')  # Overcome limited resource problems

web = 'url'
webElements_List = []

# Set up the WebDriver
driver = webdriver.Chrome(options=options)
driver.get(web)
wait = WebDriverWait(driver, 10)

# Correct the XPath expression
table_elements = driver.find_elements(By.XPATH, "//*[@id='contentContainer']/article/div/div/div/section[3]/div/table/tbody/tr")

for element in table_elements:
    webElements_List.append(element.find_element(By.XPATH, "td[1]").text)

driver.quit()
print(webElements_List)
