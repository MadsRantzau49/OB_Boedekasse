import requests
import json
from termcolor import colored
import csv
from datetime import datetime
import os

#List of players that are active in the bødekasse___________________________________________________________
club_name = "&#216;ster Sundby B 32"


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
            mobilepay_name_list.append(data["payingPlayers"][i]["dbu_name"])

    return mobilepay_name_list



#Finds all players that played a match in above matchID_______________________________________________________
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
        if club_name in line:
            #checking the file where they write ØB and then 2 lines above the location are located. 
            ØB_location = i -3

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
        if "taberd&#248;mt" in line or "Oversidder" in line:
            match_not_played = True

    home_team_scored_goals = int(home_team_scored_goals)
    away_team_scored_goals = int(away_team_scored_goals)
    ØB_RESULT = ""
    scoreboard = ""

    #fine prices
    WON = 10
    DRAW = 20
    LOSS = 30
    GOAL_CONCEDED = 5
    GOAL_SCORED = 2
    total_fine = 0

    if ØB_location == "Home":
        print("ØB:", home_team_scored_goals , "\nAway:" , away_team_scored_goals)
        if home_team_scored_goals > away_team_scored_goals:
            ØB_RESULT = "WIN"
            total_fine = WON + (GOAL_SCORED * home_team_scored_goals) + (GOAL_CONCEDED * away_team_scored_goals) 
        elif home_team_scored_goals == away_team_scored_goals:
            ØB_RESULT = "DRAW"
            total_fine = DRAW + + (GOAL_SCORED * home_team_scored_goals) + (GOAL_CONCEDED * away_team_scored_goals) 
        else:
            ØB_RESULT = "LOSE"
            total_fine = LOSS + (GOAL_SCORED * home_team_scored_goals) + (GOAL_CONCEDED * away_team_scored_goals) 
               
    else:
        print("Home:", home_team_scored_goals , "\nØB:" , away_team_scored_goals)
        if home_team_scored_goals < away_team_scored_goals:
            ØB_RESULT = "WIN"
            total_fine = WON + (GOAL_SCORED * home_team_scored_goals) + (GOAL_CONCEDED * away_team_scored_goals) 
        elif home_team_scored_goals == away_team_scored_goals:
            ØB_RESULT = "DRAW"
            total_fine = DRAW + (GOAL_SCORED * home_team_scored_goals) + (GOAL_CONCEDED * away_team_scored_goals) 
        else:
            ØB_RESULT = "LOSE"
            total_fine = LOSS + (GOAL_SCORED * home_team_scored_goals) + (GOAL_CONCEDED * away_team_scored_goals) 

    if match_not_played:
        øb_not_show_up = who_reported_cancellation(match_result_html_request,ØB_location)
        if øb_not_show_up:
            print("ØB kunne ikke stille hold", LOSS,"kr,- bøde\n")
            return LOSS
        else:
            print("Udehold udeblev eller oversidder: 0kr,- fine\n")
            return 0
    else:
        print(total_fine,"kr,- bøde\n")
        return total_fine

def who_reported_cancellation(match_result_html_request,ØB_location):   
    if ØB_location == "Home" and "Hjemmehold taberd&#248;mt" in match_result_html_request:
        return True
    else:
        return False



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


