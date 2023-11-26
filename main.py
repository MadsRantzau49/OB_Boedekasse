#!/bin/python3

from functions import *
from flask import Flask, render_template


#List of all matches__________________________________________________________________________________________
dbu_season_start_date = "15/08/2023"
dbu_match_ID_list = ["193827","193831","193834","193840","193845","193847","201625","201750","201753","202852","202855","202857","202864"]
dbu_season_ID = "409842"

#list of all active players dbu name:
dbu_players_list = dbu_names()

#list of all active players mobilepay name:
mobilepay_players_list = mobilepay_names()

#Get all active players in the match from dbu lineup
#team_lineup = find_players_in_lineup("193827",dbu_season_ID,dbu_players_list)

#Check if a player is in a lineup.
#player_in_lineup = check_if_player_is_in_lineup("202852",dbu_season_ID,"Mads Rantzau Nielsen")

#Get the result from the match from dbu result and print the result:
#for i in dbu_match_ID_list:
#    print_result(i,dbu_season_ID)

#Get the result from the match from dbu result and return the fine:
#match_result = find_result("202852",dbu_season_ID)

# RESET ALL PLAYER FINANCE JSON dept and deposit 
reset_fines(dbu_players_list)



# update all players dept
for dbu_match_ID in dbu_match_ID_list:
    team_lineup = find_team_lineup(dbu_match_ID,dbu_season_ID)
    fine = find_result(dbu_match_ID,dbu_season_ID)
    for player in dbu_players_list:
        find_dept(player,team_lineup,fine)


# find_deposit
for name in mobilepay_players_list:
    update_player_deposit(name,dbu_season_start_date)


#Print total revenue
total_revenue = total_revenue_f()

#Print current value
total_deposit = total_deposit_f()

#player still need to pay x kr,-
#for i,name in enumerate(mobilepay_players_list):
 #   player_need_to_pay = player_remain_to_pay(i)
  #  print(player_need_to_pay, name)



#Making it a webpage
app = Flask(__name__)

@app.route('/')
def index():
    player = dbu_names()
    economy_list = []
    len_list = len(player)
    for name in range(len(player)):
        dept = player_remain_to_pay(name)
        economy_list.append(dept)
    return render_template("index.html", len_list=len_list, player=player, economy_list=economy_list)
    #return gg

@app.route('/kampe')
def matches():
    return "OB MOD VEJGAARD"
app.run()
