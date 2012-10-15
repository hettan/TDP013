import selenium
from selenium import webdriver
from selenium.common.exceptions import TimeoutException
from selenium.common.exceptions import NoSuchElementException  
from selenium.webdriver.support.ui import WebDriverWait
import time

driver = webdriver.Firefox()
driver.get("http://www-und.ida.liu.se/~marhe414/")

stat = True
    
def reg(user,pw,rname):
    reguser = driver.find_element_by_id("reguser")
    regpass = driver.find_element_by_id("regpass")
    regname = driver.find_element_by_id("regname")

    time.sleep(0.5) #Need
    
    reguser.clear()
    regpass.clear()
    regname.clear()

    reguser.send_keys(user)
    regpass.send_keys(pw)
    regname.send_keys(rname)
    
    register = driver.find_element_by_id("register")
    register.click()
    
    time.sleep(1.5) #Need to wait for server response

    status = driver.find_element_by_id("err")
    return status.get_attribute("innerHTML")

def login(un,pw):
    user = driver.find_element_by_id("user")
    passw = driver.find_element_by_id("pass")

    user.clear()
    passw.clear()

    user.send_keys(un)
    passw.send_keys(pw)
    
    login = driver.find_element_by_id("go")
    login.click()
    
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

    # if reg("1","1","mac") != "Congratulations! Your account has been successfully registred.":
    #    print "wrong response5"
    #    break
    # regbtn = driver.find_element_by_id("reg")
    # regbtn.click()
    
    if reg("1","1","mac") != "The username is already in use, please try another one!":
       print "wrong response6"
       break
    
    closereg = driver.find_element_by_id("closereg")
    closereg.click()
    
    # if reg("2","2","pc") != "Congratulations! Your account has been successfully registred.":
    #     print "wrong response7"
    #     break

    print "Registration test complete"

    ###########################################
    # Testing The Login Functionality
    ###########################################

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
    # Testing Friendlist  Functionality
    ###########################################

    friends = driver.find_element_by_id("friends")
    friends.click()

    
    
    ###########################################
    # Testing *******  Functionality
    ###########################################

    
    ###########################################
    # Testing *******  Functionality
    ###########################################

    
    ###########################################
    # Testing *******  Functionality
    ###########################################

    
    ###########################################
    # Testing *******  Functionality
    ###########################################





    ##################################
    print "Test Done"
    break #last break
