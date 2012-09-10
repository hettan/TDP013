import selenium
from selenium import webdriver
from selenium.common.exceptions import TimeoutException
from selenium.webdriver.support.ui import WebDriverWait
import time

def post(message):
    postMessage = driver.find_element_by_id("txtInput")
    postMessage.send_keys(message)
    postMessage.submit()

    status = driver.find_element_by_id("divStatus")
    return status.get_attribute("value")

def noPosts():
    posts = driver.find_element_by_id("divMessages")
    for post in posts:
        return False
    return True

driver = webdriver.Firefox()
driver.get("http://www-und.ida.liu.se/~jacho391/lab1.html")


shortPost = ""
goodPost = "Hej!"
longPost = "x" * 145

print post(shortPost)
print post(goodPost)
print post(longPost)

driver.Navigate().Refresh()
if noPosts():
    "Refresh successfull"
else:
    "Error, posts were not deleted"
