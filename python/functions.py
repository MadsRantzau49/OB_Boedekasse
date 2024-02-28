import requests
import json
import csv
from datetime import datetime
import os


#____________________________________________________________________PLAYERS___________________________________________________________



#find the dbu names:
def dbu_names():
    dbu_name_list = []
    with open(os.path.dirname(__file__)+"/player_finance.json","r") as ap:
        data = json.load(ap)
        for i in range(len(data["payingPlayers"])):
            dbu_name_list.append(data["payingPlayers"][i]["dbu_name"])

    return dbu_name_list


#find the mobile names:
def mobilepay_names():
    mobilepay_name_list = []
    with open(os.path.dirname(__file__)+"/player_finance.json","r") as ap:
        data = json.load(ap)
        for i in range(len(data["payingPlayers"])):
            mobilepay_name_list.append(data["payingPlayers"][i]["mobilepay_name"])

    return mobilepay_name_list

 
# RESET ALL PLAYER FINANCE JSON FILE + adding with active paying players list 
#Reset everything exepct for extra fines for exampel yellow cars og taberdømt kamp osv. 
def reset_fines(players_list):
    with open(os.path.dirname(__file__)+"/player_finance.json","r+") as ap:
        data = json.load(ap)
        for i in range(len(players_list)):
            data["payingPlayers"][i]["Dept"] = 0
            data["payingPlayers"][i]["Deposit"] = 0

        # Move the file pointer to the beginning of the file before writing
        ap.seek(0)
        
        # Write the updated data back to the file
        json.dump(data, ap, indent=4)

        # Truncate the file to the current file position to remove any extra data. because the file add some weird ]} in the end. 
        ap.truncate()




#_______________________________________________________________________________________________MATCH DATA_________________


#Finds all players that played a match in above matchID
def find_team_lineup(match_id,dbu_season_ID):
    team_lineup_url = "https://www.dbu.dk/resultater/kamp/" + match_id + "_"+dbu_season_ID+"/holdopstillinger"

    #request html code from dbu.dk
    team_lineup_html_request = requests.get(team_lineup_url)
    team_lineup_html_request.encoding = "utf-8"
    return team_lineup_html_request.text


def find_players_in_lineup(match_id,dbu_season_ID,dbu_players_list):
    #get the data from dbu.dk
    team_lineup_html_request = find_team_lineup(match_id,dbu_season_ID)
    
    #The list with all players which play the specific match
    match_lineup = []
    for player_name in dbu_players_list:
        if player_name in team_lineup_html_request:
            match_lineup.append(player_name)
    return match_lineup


#find one specific player
def find_player_in_lineup(match_id,dbu_season_ID,dbu_player):
    #get the data from dbu.dk
    team_lineup_html_request = find_team_lineup(match_id,dbu_season_ID)
    
    #The list with all players which play the specific match
    if dbu_player in team_lineup_html_request:
        return 1
    else:
        return 0

def print_result(match_id,dbu_season_ID):
    match_result_url = "https://www.dbu.dk/resultater/kamp/" + match_id + "_"+dbu_season_ID+ "_409842/kampinfo"
    
    #request html code from dbu.dk
    match_result_html_request = requests.get(match_result_url)
    match_result_html_request = match_result_html_request.text
    lines = match_result_html_request.split('\n')

    
    ØB_location = 0
    match_result_line = 0
    match_not_played = False

    home_team_scored_goals = 0
    away_team_scored_goals = 0
    
    

    for i,line in enumerate(lines):
        #checking which line number ØB is called
        if ">&#216;ster Sundby B 32</span>" in line:
            #checking the file where they write ØB and then 2 lines above the location are located. 
            ØB_location = i -1
            #ØB location line
            ØB_location = lines[ØB_location]
            ØB_location = ØB_location.strip()
            ØB_location = ØB_location.find("Hjemmehold")
            if ØB_location != -1:
                ØB_location = "Home"
            else:
                ØB_location = "Away"

        #check in which line the result is on.
        if "<label>Resultat</label>" in line:
            #print('found at line:', num)
            match_result_line = i +1
            match_result_string = lines[match_result_line]
            match_result_string = match_result_string.strip()
            #removing the <span> in the beginningen of the string
            match_result_string = match_result_string[6:]
            #removing the </span> in the end of the string so now after this line there is only the result like 2-1 but as a string
            match_result_string = match_result_string[:-7]
            for i in range(0,len(match_result_string)):
                if match_result_string[i] == "-":
                    #home_team_scored_goals are everything before "-"
                    home_team_scored_goals = match_result_string[:i]
                    #away_team_scored_goals are everything after "-"
                    away_team_scored_goals = match_result_string[i+1:]

            
        #check if the match are not played    
        if "taberd&#248;mt" in line:
            match_not_played = True

    home_team_scored_goals = int(home_team_scored_goals)
    away_team_scored_goals = int(away_team_scored_goals)

    if match_not_played:
            øb_not_show_up = who_reported_cancellation(match_result_html_request,ØB_location)
            if øb_not_show_up:
                match_not_played = [2,"ØB","Kunne ikke stille hold"]
                return match_not_played
            else:
                match_not_played = [2,"Udehold","Kunne ikke stille hold"]
                return match_not_played
    if ØB_location == "Home":
        match_result_list = [0,home_team_scored_goals,away_team_scored_goals]
    else:
        match_result_list = [1,home_team_scored_goals,away_team_scored_goals]

    return match_result_list


#Find the result from a match and return the fine for the current match.
def find_result(match_id,dbu_season_ID):
    match_result_url = "https://www.dbu.dk/resultater/kamp/" + match_id + "_"+dbu_season_ID+ "_409842/kampinfo"
    
    #request html code from dbu.dk
    match_result_html_request = requests.get(match_result_url)
    match_result_html_request = match_result_html_request.text
    lines = match_result_html_request.split('\n')

    
    ØB_location = 0
    match_result_line = 0
    match_not_played = False

    home_team_scored_goals = 0
    away_team_scored_goals = 0
    
    

    for i,line in enumerate(lines):
        #checking which line number ØB is called
        if ">&#216;ster Sundby B 32</span>" in line:
            #checking the file where they write ØB and then 2 lines above the location are located. 
            ØB_location = i -1

            #ØB location line
            ØB_location = lines[ØB_location]
            ØB_location = ØB_location.strip()
            ØB_location = ØB_location.find("Hjemmehold")
            if ØB_location != -1:
                ØB_location = "Home"
            else:
                ØB_location = "Away"

        #check in which line the result is on.
        if "<label>Resultat</label>" in line:
            #print('found at line:', num)
            match_result_line = i +1
            match_result_string = lines[match_result_line]
            match_result_string = match_result_string.strip()
            #removing the <span> in the beginningen of the string
            match_result_string = match_result_string[6:]
            #removing the </span> in the end of the string so now after this line there is only the result like 2-1 but as a string
            match_result_string = match_result_string[:-7]
            for i in range(0,len(match_result_string)):
                if match_result_string[i] == "-":
                    #home_team_scored_goals are everything before "-"
                    home_team_scored_goals = match_result_string[:i]
                    #away_team_scored_goals are everything after "-"
                    away_team_scored_goals = match_result_string[i+1:]

            
        #check if the match are not played    
        if "taberd&#248;mt" in line:
            match_not_played = True

    home_team_scored_goals = int(home_team_scored_goals)
    away_team_scored_goals = int(away_team_scored_goals)

    #fine prices
    WON = 10
    DRAW = 20
    LOSS = 30
    GOAL_CONCEDED = 5
    GOAL_SCORED = 2
    if match_not_played:
        return 0

    if ØB_location == "Home":
        if home_team_scored_goals > away_team_scored_goals:
            return WON + (GOAL_SCORED * home_team_scored_goals) + (GOAL_CONCEDED * away_team_scored_goals) 
        elif home_team_scored_goals == away_team_scored_goals:
            return DRAW + + (GOAL_SCORED * home_team_scored_goals) + (GOAL_CONCEDED * away_team_scored_goals) 
        else:
            return LOSS + (GOAL_SCORED * home_team_scored_goals) + (GOAL_CONCEDED * away_team_scored_goals) 
               
    else:
        if home_team_scored_goals < away_team_scored_goals:
            return WON + (GOAL_SCORED * away_team_scored_goals) + (GOAL_CONCEDED * home_team_scored_goals) 
        elif home_team_scored_goals == away_team_scored_goals:
            return DRAW + (GOAL_SCORED * away_team_scored_goals) + (GOAL_CONCEDED * home_team_scored_goals) 
        else:
            return LOSS + (GOAL_SCORED * away_team_scored_goals) + (GOAL_CONCEDED * home_team_scored_goals) 


#check if øb cancel (I DONT USE IT RIGHT NOW)
def who_reported_cancellation(match_result_html_request,ØB_location):   
    if ØB_location == "Home" and "Hjemmehold taberd&#248;mt" in match_result_html_request:
        #tilføj en bøde til hele holdet.
        pass 
    else:
        return 0
    



#___________________________________________________________________________________________________DEPT___________________


# Find player's dept and print fines.
def print_dept(player,dbu_match_ID,dbu_season_ID,team_lineup):
    fine = 0
    if player in team_lineup:
        fine += find_result(dbu_match_ID,dbu_season_ID)
        print_result(dbu_match_ID,dbu_season_ID)
    print(player,fine)    

# find players dept.
def find_dept(player,team_lineup,fine):
    if player in team_lineup:
        update_dept(player,fine)        

    
#update player's dept in JSON file
def update_dept(player,dept):
    with open(os.path.dirname(__file__)+"/player_finance.json","r+") as ap:
        data = json.load(ap)
        all_players = dbu_names()
        for i in range(len(all_players)):
            if (data["payingPlayers"][i]["dbu_name"] == player):
                data["payingPlayers"][i]["Dept"] += dept
                ap.seek(0)  # Move the cursor to the beginning of the file
                json.dump(data, ap, indent=4)
                ap.truncate()  # Truncate the remaining data in the file
                break


#_______________________________________________________________________________________________DEPOSIT___________

#Reads all transactions from the mobilepay box from the new season and update the player deposit
def update_player_deposit(player,dbu_season_start_date):
    with open(os.path.dirname(__file__)+"/trans.csv","r+") as ap:
        mobilepay_box_data = csv.reader(ap)

        #define the start season date to a datetime instead of string so it can be compared.
        dbu_season_start_date = datetime.strptime(dbu_season_start_date, "%d/%m/%Y")
        for row in mobilepay_box_data:
            # Extract the date string from the CSV row
            transfer_date_str = row[0].split(',')[0].strip()

            # Convert the date string to a datetime object
            transaction_date = datetime.strptime(transfer_date_str, "%d/%m/%Y %H:%M")

            if transaction_date > dbu_season_start_date:    
                #Row[1] is name 
                name = row[1]
                #Row[3] is deposit number
                deposit_number = row[3]
                deposit_number = int(deposit_number)
                if (player in name and deposit_number > 0):
                    with open(os.path.dirname(__file__)+"/player_finance.json","r+") as ap:
                        data = json.load(ap)
                        all_players = mobilepay_names()
                        for i in range(len(all_players)):
                            if (data["payingPlayers"][i]["mobilepay_name"] == player):
                                data["payingPlayers"][i]["Deposit"] += deposit_number
                                ap.seek(0)  # Move the cursor to the beginning of the file
                                json.dump(data, ap, indent=4)
                                ap.truncate()  # Truncate the remaining data in the file
                                break




                            


#_______________________________________________________________________________________________________FACTS____________
def total_revenue_f():
    with open(os.path.dirname(__file__)+"/trans.csv","r+") as ap:
        mobilepay_box_data = csv.reader(ap)
        deposit_number = 0
        for row in mobilepay_box_data:
            #Row[3] is deposit number but as a string
            deposit_number += int(row[3])
        return deposit_number


def total_deposit_f():
    with open(os.path.dirname(__file__)+"/player_finance.json","r+") as ap:
        data = json.load(ap)
        members = mobilepay_names()
        total_deposit = 0
        for i in range(len(members)):
            total_deposit += data["payingPlayers"][i]["Dept"]
        return total_deposit


def player_remain_to_pay(player_id):
    with open(os.path.dirname(__file__)+"/player_finance.json","r+") as ap:
        data = json.load(ap)
        dept = data["payingPlayers"][player_id]["Dept"]
        deposit = data["payingPlayers"][player_id]["Deposit"]
        #extra_fine = data["payingPlayers"][player_id]["extra_fines"]
        return deposit - dept #- extra_fine
