import selenium
from selenium import webdriver
from selenium.common.exceptions import TimeoutException
from selenium.webdriver.support.ui import WebDriverWait
import time

def post(message):
    postMessage = driver.find_element_by_id("txtInput")
    postMessage.send_keys(message)
    postButton = driver.find_element_by_id("btnPost")
    postButton.click()
    
    status = driver.find_element_by_id("divStatus")
    return status.get_attribute("innerHTML")

def noPosts():
    posts = driver.find_elements_by_xpath("//div[@id='divMessages']")
    return (len(posts) == 1)

driver = webdriver.Firefox()
driver.get("http://www-und.ida.liu.se/~jacho391/lab1.html")


shortPost = ""
goodPost = "Hej!"
longPost = "x" * 145

print post(shortPost)
print post(goodPost)
print post(longPost)

driver.refresh()
if noPosts():
    print "Refresh successfull"
else:
    print "Error, posts were not deleted"
