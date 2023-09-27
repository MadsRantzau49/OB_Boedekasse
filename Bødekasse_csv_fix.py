import requests
import json
from termcolor import colored
import csv
from datetime import datetime


 #List of players that are active in the bødekasse
players = ["Mads Rantzau Nielsen",
"Jannik L&#228;gel Johansson",
"Markus Bruun Jakobsen",
"Johnni Bjerregaard",
"Andreas Ahrenfeldt Laursen",
"Phillip Wulff Kold",
"Lasse Christensen",
"Jakob Juul",
"Kristian Pedersen",
"Martin B&#248;gh Eliasen",
"Poul S&#248;nderup",
"Mathias Bundgaard Jensen",
"Thomas Werner",
"Mikkel Vangsted",
"Michael Buus",
"David Nielsen",
"Nikolaj Ovesen",
"Rico Gertsen",

"Andet"

]

# RESET ALL PLAYER FINANCE JSON FILE + adding with active paying players list 
#Reset everything exepct for extra fines for exampel yellow cars og taberdømt kamp osv. 
with open("D:/code/bkasse_2023/playerFinance.json", "r") as pf:
     data = json.load(pf)

for i,naames in enumerate(players):
    with open("D:/code/bkasse_2023/playerFinance.json","w") as pf:
        data["payingPlayers"][i]["name"] = naames
        data["payingPlayers"][i]["Dept"] = 0
        data["payingPlayers"][i]["Deposit"] = 0
        json.dump(data,pf,indent = 4)


#print("Insert matchid")
#kampnr = input()
#print("\n")


matchindex = ["193827","193831","193834","193840","193845","193847","201625","201750","201753","202852","202855","202857","202864"]

for a in matchindex:
    
     playerlist = "https://www.dbu.dk/resultater/kamp/" + a + "_409842/holdopstillinger"
     matchResult = "https://www.dbu.dk/resultater/kamp/" + a + "_409842/kampinfo"

     team = requests.get(playerlist)
     result = requests.get(matchResult)

     #team = requests.get("https://www.dbu.dk/resultater/kamp/418399_399173/holdopstillinger")
     #result = requests.get("https://www.dbu.dk/resultater/kamp/418399_399173/Kampinfo")

     #Make the html page to a string. 
     teamPage = team.text
     resultPage = result.text

     #Creates a file with all result info
     f = open("D:/code/bkasse_2023/Result.txt", "w")
     f.write(resultPage)
     f.close()

     #Creates a file with listed players
     p = open("D:/code/bkasse_2023/players.txt", "w")
     p.write(teamPage)
     p.close()
     #Open the files and extract the above line of the result
     r = open("D:/code/bkasse_2023/Result.txt", "r")   


     resultLine = 0
     OB_location = 0    
     for num, line in enumerate(r, 1):
          if ">&#216;ster Sundby B 32</span>" in line:
               #checking the file where they write ØB and then 2 lines above the location are located. 
               OB_location = num -3
               #print("line",OB_location)
          if "<label>Resultat</label>" in line:
               #print('found at line:', num)
               resultLine = num +1
     #print(resultLine)
     line = open("D:/code/bkasse_2023/Result.txt", "r").readlines()[resultLine]

     #print øb location line
     OB_Loc = open("D:/code/bkasse_2023/Result.txt", "r").readlines()[OB_location]

     #check if the match are taberdømt
     taberdømt = False
     if "taberd&#248;mt" in line:
          taberdømt = True
          print("\nEt hold er taberdømt, All players paying 30kr,- \n",players,"\n\n")

     if resultLine > 0 and taberdømt == False:

          #print(resultLine)
          line = open("D:/code/bkasse_2023/Result.txt", "r").readlines()[resultLine]

          #print øb location line
          OB_Loc = open("D:/code/bkasse_2023/Result.txt", "r").readlines()[OB_location]
          OB_Loc_strip = OB_Loc.strip()
          OB_Loc_Key = OB_Loc_strip.find("Hjemmehold")
          if OB_Loc_Key != -1:
               OB_official_location = "Home"
          else:
               OB_official_location = "Away"
   
          #Remove spaces
          line_stripped = line.strip()

          #remove the first 6 charaters
          line_rm = line_stripped[6:]
          away_line_rm = 0
          
          #Check if some of the teams as won by 2 digits.
          homeTeamScore = 0
          awayTeamScore = 0
          for i in range(0, len(line_rm)):
               if line_rm[i] == "-":
                    homeTeamScore = line_rm[:i]
               #removing the last span part
               if line_rm[i] == "<":
                    away_line_rm = line_rm[:i]
          for g in range(0,len(away_line_rm)):
               if away_line_rm[g] == "-":
                    awayTeamScore = away_line_rm[g+1:]

          r.close()
          #Hometeam score
          #print("HomeTeam- ",homeTeamScore)

          #awayteam score:
          #print("AwayTeam- ",awayTeamScore)
               
          #Writing the result, plus checking if its a ØB win, draw or lose
          

          OB_RESULT = 0
          fine = 0
          if OB_official_location == "Home":
               scoreboard = "Result:\nØB- "+ homeTeamScore + "  Away- " + awayTeamScore
               if homeTeamScore > awayTeamScore:
                    OB_RESULT = "WIN"
                    fine = 10 + (int(homeTeamScore)*2) + (int(awayTeamScore) *5)
               elif homeTeamScore == awayTeamScore:
                    OB_RESULT = "DRAW"
                    fine = 20 + (int(homeTeamScore)*2) + (int(awayTeamScore) *5)
               else:
                    OB_RESULT = "LOSE"
                    fine = 30 + (int(homeTeamScore)*2) + (int(awayTeamScore) *5)
               
          else:
               scoreboard = "Result:\nHome- "+ homeTeamScore + "  ØB- " + awayTeamScore
               if homeTeamScore < awayTeamScore:
                    OB_RESULT = "WIN"
                    fine = 10 + (int(homeTeamScore)*5) + (int(awayTeamScore) *2)
               elif homeTeamScore == awayTeamScore:
                    OB_RESULT = "DRAW"
                    fine = 20 + (int(homeTeamScore)*5) + (int(awayTeamScore) *2)
               else:
                    OB_RESULT = "LOSE"
                    fine = 30 + (int(homeTeamScore)*5) + (int(awayTeamScore) *2)
          print(scoreboard)
          print("\nØB",OB_RESULT,"  =",fine,"kr,- fine\n")


         
          playerslist = []
          for p in players:
               if p in teamPage:
                    #print(p)
                    playerslist.append(p)
          print(len(playerslist),"paying players was active in that game:\n",playerslist,"\n")
               
               

          #Få det ind i en database
          with open("D:/code/bkasse_2023/playerFinance.json", "r") as pf:
               data = json.load(pf)

          #Checking how many active paying members we have total
          members = len(data["payingPlayers"])

          #find the members from the database versus those players who played the game.              
          for i in playerslist:
               for c in range(0,members):
                    if i == data["payingPlayers"][c]["name"]:
                         with open("D:/code/bkasse_2023/playerFinance.json","w") as pf:
                              data["payingPlayers"][c]["Dept"] = data["payingPlayers"][c]["Dept"] + fine
                              #print(data["payingPlayers"][c]["name"]," Dept are- ",data["payingPlayers"][c]["Dept"],"kr,-")                    
                              json.dump(data,pf, indent=4)

          pf.close()








#-------------------------------MOBILEPAY TRANSACTION----------------------------------------#
playersMP = ["Mads Rantzau Nielsen",
           "Jannik LÃ¤gel Johansson",
           "Markus Bruun Jakobsen",
           "Johnni Bjerregaard",
           "Andreas Ahrenfeldt Laursen",
           "Phillip Wulff",
           "Lasse Christensen",
           "Nicolai Ottesen",
           "Jakob Sejer Juul",
           "Kristian Pedersen",
           "Martin BÃ¸gh Eliasen",
           "David Nielsen",
           "Poul Lynggaard SÃ¸nderup",
           "Mathias Bundgaard Jensen",
           "Thomas Werner",
           "Mikkel Vangsted",
           "Nikolaj Ovesen",
           "Rico Søndergaard Gertsen",
           "Michael Buus",

           ]

forbudteListe=["Jannik LÃ¤gel Johansson",
               "Poul Lynggaard SÃ¸nderup",
               "Martin BÃ¸gh Eliasen",
               "Jakob Sejer Juul",
               "Phillip Wulff",
               "Rico Søndergaard Gertsen",
               "g","g","g","g","g","g","g","g","g","g","g","g","g","g","g","g","g","g","g","g","g","g"
              ]




with open("D:/code/bkasse_2023/playerFinance.json", "r") as pf:
     data = json.load(pf)


members = len(data["payingPlayers"])
#reset dept so it wont overwrite.
for v in range(0,members):
    with open("D:/code/bkasse_2023/playerFinance.json", "w") as pft:
        data["payingPlayers"][v]["Deposit"] = 0
        json.dump(data,pft, indent=4)



#Get overall mobilepay, its used in next section
restSum = 1260
beerBudget = 0

#open the trans file with all mobilepay transactions
with open("D:/code/bkasse_2023/trans.csv", "r") as trans_file_csv:
     trans_reader_csv = csv.reader(trans_file_csv)

     threshold_date_str = "15/08/2023"
     threshold_date = datetime.strptime(threshold_date_str, "%d/%m/%Y")

     #for loop for every mobilepay transactions
     for row in trans_reader_csv:
          # Extract the date string from the CSV row
          date_str = row[0].split(',')[0].strip()
    
          # Convert the date string to a datetime object
          transaction_date = datetime.strptime(date_str, "%d/%m/%Y %H:%M")
          
          # Compare the transaction date with the threshold date
          if transaction_date > threshold_date:
               #for loop for every active players
               for c in playersMP:
                    #check if the mobilepay transactions are from a active player
                    if c in row[1]: 
                         playerMP_Name = row[1]
                         playerPayed = row[3]
                         intPlayerPayed = int(playerPayed)    

                         for a in range(0,members):
                                                  
                              #Updates those name with fucked charaters / different DBU and mobilepay names.
                              fuckedName = "GG"
                              if c in forbudteListe:
                                   if c == "Jannik LÃ¤gel Johansson":
                                        fuckedName = "Jannik L&#228;gel Johansson"
                                   elif c == "Poul Lynggaard SÃ¸nderup":
                                        fuckedName = "Poul S&#248;nderup"
                                   elif c == "Martin BÃ¸gh Eliasen":
                                        fuckedName = "Martin B&#248;gh Eliasen"
                                   elif c == "Jakob Sejer Juul":
                                        fuckedName = "Jakob Juul"
                                   elif c == "Phillip Wulff":
                                        fuckedName = "Phillip Wulff Kold"
                                   elif c == "Rico SÃ¸ndergaard Gertsen":
                                        fuckedName = "Rico Gertsen"
                                   


                              #If mobilepay transfer is from a "fuckedplayer" player differents name from dbu and mobilepay
                              if fuckedName == data["payingPlayers"][a]["name"] and intPlayerPayed > 0:
                                   with open("D:/code/bkasse_2023/playerFinance.json","w") as pf:
                                        data["payingPlayers"][a]["Deposit"] = data["payingPlayers"][a]["Deposit"] + intPlayerPayed
                                        #print(data["payingPlayers"][a]["name"]," Have deposit- ",data["payingPlayers"][a]["Deposit"],"kr,-")                    
                                        json.dump(data,pf, indent=4)
                                        pf.close()
                                             
                              #If DBU name == mobilepay name                         
                              elif c == data["payingPlayers"][a]["name"] and intPlayerPayed > 0:
                                   with open("D:/code/bkasse_2023/playerFinance.json","w") as pf:
                                        data["payingPlayers"][a]["Deposit"] = data["payingPlayers"][a]["Deposit"] + intPlayerPayed
                                        #print(data["payingPlayers"][a]["name"]," Have deposit- ",data["payingPlayers"][a]["Deposit"],"kr,-")                    
                                        json.dump(data,pf, indent=4)
                                        pf.close()  
               
     

#------------------------------------GET OVERVIEW OF YOUR DEPT AND DEPOSIT----------------#

#the space are important because they ues the open trans file above
     value = float(row[-1])  # Access the last element in each row

     if value > 0:
          restSum += value
     else:
          beerBudget += value
     
     


with open("D:/code/bkasse_2023/playerFinance.json", "r") as pf:
     data = json.load(pf)

members = len(data["payingPlayers"])

membersSum = 0

#Finding sum of transaction 
for count in range(0,members):
     deposit = data["payingPlayers"][count]["Deposit"]
     membersSum += deposit
overAllSum = restSum - membersSum 

#Print the rest to the account "andet"
with open("D:/code/bkasse_2023/playerFinance.json" , "w") as pf:
     for i,g in enumerate(players):
          if g == "Andet":
               data["payingPlayers"][i]["Deposit"] = overAllSum
               json.dump(data,pf, indent=4)
boxBalance = 2731
print("List of players econmy: \nBoxnr: 1783QN \n")
lst = []
for i in range(0,members):
     name = data["payingPlayers"][i]["name"]
     dept = data["payingPlayers"][i]["Dept"]
     deposit = data["payingPlayers"][i]["Deposit"]
     extra_fine = data["payingPlayers"][i]["extra_fines"]
     result = deposit - dept - extra_fine
     lst.append(result)
     boxBalance += result
     color = "White"
     if result > 0:
          color = "blue"
     elif result == 0:
          color = "green"
     else:
          color = "red"

     print(colored(name,color),colored(":",color),colored(result,color),colored("kr,-",color))

positive_beerBudget = abs(beerBudget)
print("Total money spend on beer's /tape              ",positive_beerBudget ,"kr,-")
#print("Total box amount:                        ",restSum + beerBudget ,"kr,-")
#print("Total fines deposit                      ",restSum,"kr,-")
print("Box Balance:                             ", boxBalance,"kr,-")
positiv_boxBalance = abs(boxBalance)
positiv_sum = abs(sum(lst))
print("Potential balance if people pay their dept" , positiv_boxBalance + positiv_sum + beerBudget,"kr,-")

