import selenium
from selenium import webdriver
from selenium.common.exceptions import TimeoutException
from selenium.common.exceptions import NoSuchElementException  
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.common.action_chains import ActionChains

import time

driver = webdriver.Firefox()
driver.get("http://www-und.ida.liu.se/~marhe414/")

stat = True
#window_maximize

def reg(user,pw,rname):
    reguser = driver.find_element_by_id("reguser")
    regpass = driver.find_element_by_id("regpass")
    regname = driver.find_element_by_id("regname")

    time.sleep(1) #Need
    
    reguser.clear()
    regpass.clear()
    regname.clear()

    reguser.send_keys(user)
    regpass.send_keys(pw)
    regname.send_keys(rname)
    
    driver.find_element_by_id("register").click()
    
    time.sleep(2) #Need to wait for server response
    
    return driver.find_element_by_id("err").get_attribute("innerHTML")

def login(un,pw):
    user = driver.find_element_by_id("user")
    passw = driver.find_element_by_id("pass")

    user.clear()
    passw.clear()

    user.send_keys(un)
    passw.send_keys(pw)
    
    driver.find_element_by_id("go").click()
  
    time.sleep(1.5)

    try:
        error = driver.find_element_by_id("error")
    except NoSuchElementException:
        return "moved on with login"
    return error.get_attribute("innerHTML")

while(stat):
    
    ###########################################
    # Starting The Testloop
    ###########################################
    # Testing The Register Functionality
    ###########################################
    
    regbtn = driver.find_element_by_id("reg")
    regbtn.click()
    if reg("","","") != "Please Enter A Username":
        print "wrong response1"
        break

    if reg("1","","") != "Please Enter A Password":
        print "wrong response2"
        breakpas = "1"

    if reg("qazwsxedcrfvtgbyhnujmiklop","1","") != "Please Enter A Shorter Username":
        print "wrong response3"
        break

    if reg("1","1","") != "Please Enter A Name":
        print "wrong response4"
        break

    if reg("1","1","mac") != "Congratulations! Your account has been successfully registred.":
        print "wrong response5"
        break

    time.sleep(1)
    regbtn = driver.find_element_by_id("reg")
    regbtn.click()
    
    if reg("1","1","mac") != "The username is already in use, please try another one!":
       print "wrong response6"
       break
    
    if reg("2","2","pc") != "Congratulations! Your account has been successfully registred.":
        print "wrong response7"
        break

    
    regbtn = driver.find_element_by_id("reg")
    regbtn.click()
    time.sleep(1)
    reg("3","3","derp")
    time.sleep(1)
    regbtn = driver.find_element_by_id("reg")
    regbtn.click()
    reg("4","4","zomg")
    time.sleep(1)
    regbtn = driver.find_element_by_id("reg")
    regbtn.click()
    time.sleep(1)
    reg("5","5","lulz")

    print "Registration test complete"

    ###########################################
    # Testing The Login Functionality
    ###########################################
    
    time.sleep(2)
    
    if login("","") != "Wrong Password or Username":
        print "wrong response8"
        break

    if login("asdasw","asd98nu") != "Wrong Password or Username":
        print "wrong response9"
        break
    
    if login("1","1") == "Wrong Password or Username":
        print "wrong response9"
        break

    print "Login test complete"

    
    ###########################################
    # Testing  links   Functionality
    ###########################################

    driver.find_element_by_id("friends").click()
    time.sleep(2)
    if driver.find_element_by_id("topic").get_attribute("innerHTML") != " Friends ":
        print "wrong response10"
        break
    
    driver.find_element_by_id("profile").click()
    time.sleep(1)
    if driver.find_element_by_id("topic").get_attribute("innerHTML") != " Wall ":
        print "wrong response11"
        break
    driver.find_element_by_id("friends").click()
    time.sleep(1)
    print "Links test complete"

    ###########################################
    # Testing  Search  Functionality
    ###########################################

    driver.find_element_by_id("search").send_keys("p")
    time.sleep(1)
    driver.find_element_by_id("search").send_keys("\n")
    time.sleep(1)
    driver.find_element_by_id("2").click()
    time.sleep(1)
    if driver.find_element_by_id("username").get_attribute("innerHTML") != "2":
        print "wrong response12"
        break
    
    print "Search test complete"
    
    ###########################################
    # Testing Friend Functionality
    ###########################################

    driver.find_element_by_id("friendadd").click()
    time.sleep(1)
    driver.find_element_by_id("friends").click()
    time.sleep(1)

    driver.find_element_by_id("2").click()
   # driver.find_elements_by_xpath("//*[@class='friendlisted']")[1].click()
    time.sleep(1)
    
    if driver.find_element_by_id("username").get_attribute("innerHTML") != "2":
        print "wrong response13"
        break
    time.sleep(1)

    print "Friends test complete"
    
    ###########################################
    # Testing Wall Functionality
    ###########################################

    driver.find_element_by_id("post").send_keys("Testing sent by user1")
    time.sleep(1)
    driver.find_element_by_id("sendpost").click()
    time.sleep(1)
#    driver.find_element_by_id("friends").click()
#    time.sleep(1)
#    driver.find_element_by_id("2").click()
#    time.sleep(1)

    time.sleep(6)
    
    if driver.find_elements_by_xpath("//*[@class='posts']//pre")[0].get_attribute("innerHTML") != "Testing sent by user1":
        print "wrong response14"
        break
    
    ##################################
    print "Done ~~~~~~~~ Done "
    stat = False
