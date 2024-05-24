import chromedriver_autoinstaller
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time

# Install ChromeDriver if not installed
chromedriver_autoinstaller.install()

# Set up WebDriver options
options = Options()
# options.add_argument('--headless')  # Run headless browser
options.add_argument('--disable-gpu')  # Disable GPU acceleration
options.add_argument('--no-sandbox')  # Required for Docker
options.add_argument('--disable-dev-shm-usage')  # Overcome limited resource problems

web = 'https://docs.oracle.com/en/cloud/saas/human-resources/24b/oedmh/toc.htm#4-Benefits'
toc_xpath = '//*[@id="contentContainer"]/article/div/ul[3]/li[1]/ul/li/a'  # XPath for the table of contents links

# Open the XML file in write mode to start with the root element
with open("output.xml", "w", encoding="utf-8") as file:
    file.write('<?xml version="1.0" encoding="UTF-8"?>\n')
    file.write('<root>\n')

# Set up the WebDriver
driver = webdriver.Chrome(options=options)
driver.get(web)
wait = WebDriverWait(driver, 10)

# Get the table of contents links
toc_links = driver.find_elements(By.XPATH, toc_xpath)
toc_urls = [link.get_attribute('href') for link in toc_links]

for url in toc_urls:
    driver.get(url)
    wait.until(EC.presence_of_element_located((By.XPATH, "//*[@class='chapterstart']")))
    time.sleep(1)  # Additional delay to ensure the page is fully loaded

    # Correct the XPath expression
    key_elements = driver.find_elements(By.XPATH, "//*[@class='chapterstart']")
    table_elements = driver.find_elements(By.XPATH, "//*[@id='contentContainer']/article/div/div/div/section[3]/div/table/tbody/tr")

    with open("output.xml", "a", encoding="utf-8") as file:
        for key_element in key_elements:
            key = key_element.text
            file.write(f'  <key_element name="{key}">\n')

            for element in table_elements:
                value = element.find_element(By.XPATH, "td[1]").text
                file.write(f'    <value>{value}</value>\n')
            print(f"Key: {key}, Value: {value}")
            file.write('  </key_element>\n')
            

driver.quit()

# Close the root element in the XML file
with open("output.xml", "a", encoding="utf-8") as file:
    file.write('</root>')

print("Data has been written to output.xml")
