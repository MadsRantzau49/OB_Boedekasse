#!/bin/python3

from functions import *
from flask import Flask, render_template, request

def dbu_match_list_f():
    dbu_match_ID_list = ["193827","193831","193834","193840","193845","193847","201625","201750","201753","202852","202855","202857","202864"]
    return dbu_match_ID_list

def dbu_season():
    return "409842"
def dbu_season_date():
    return "15/08/2023"


#Making it a webpage
app = Flask(__name__)

@app.route('/')
def index():
    #all matches
    dbu_match_ID_list = dbu_match_list_f()
    
    #season ID
    dbu_season_ID = dbu_season()

    #season starting date
    dbu_season_start_date = dbu_season_date()

    #list of all active players dbu name:
    dbu_players_list = dbu_names()

    #list of all active players mobilepay name:
    mobilepay_players_list = mobilepay_names()


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

    economy_list = []
    len_list = len(dbu_players_list)
    for name in range(len(dbu_players_list)):
        dept = player_remain_to_pay(name)
        economy_list.append(dept)
    return render_template("index.html", len_list=len_list, player=dbu_players_list, economy_list=economy_list)
    #return gg

@app.route('/kampe')
def matches():
    #get the match id and the season
    dbu_match_ID_list = dbu_match_list_f()
    dbu_season_ID = dbu_season()

    match_result_list = []
    match_fine_list = []
    for i in dbu_match_ID_list:
        match_result = print_result(i,dbu_season_ID)
        match_result_list.append(match_result)
    len_list = len(match_result_list)

    for i in dbu_match_ID_list:
        fine = find_result(i,dbu_season_ID)
        match_fine_list.append(fine)
    return render_template("matches.html", len_list=len_list, match_result_list=match_result_list,match_fine_list=match_fine_list)
   

@app.route('/regler')
def rules():
    return render_template("regler.html")

@app.route('/tjek-spiller', methods=['POST','GET'])
def check_player():
    dbu_players_list = dbu_names()
    if request.method == 'POST':
        player = request.form['spiller']

        match_id_list = dbu_match_list_f()
        dbu_season_ID = dbu_season()
        
        active_list = []
        fine_list = []
        for match_id in match_id_list:
            player_in_match = find_player_in_lineup(match_id,dbu_season_ID,player)
            if player_in_match == 1:
                active_list.append(match_id)
        for active_match_id in active_list:
            fine = find_result(active_match_id,dbu_season_ID)
            fine_list.append(fine)
        
        fine_sum = sum(fine_list)
        len_active_games = len(active_list)
        return render_template("tjek_spiller.html",dbu_players_list=dbu_players_list, player=player,  fine_list=fine_list,active_list=active_list, dbu_season_ID=dbu_season_ID, len_active_games=len_active_games,fine_sum=fine_sum)
    else:
        player = request.args.get('spiller')
        return render_template("tjek_spiller.html",dbu_players_list=dbu_players_list,player=player)


    


if __name__ == '__main__':
    app.run(host='0.0.0.0',port='5001',debug=True)





#Get all active players in the match from dbu lineup
#team_lineup = find_players_in_lineup("193827",dbu_season_ID,dbu_players_list)

#Check if a player is in a lineup.
#player_in_lineup = check_if_player_is_in_lineup("202852",dbu_season_ID,"Mads Rantzau Nielsen")

#Get the result from the match from dbu result and print the result:
#for i in dbu_match_ID_list:
#    print_result(i,dbu_season_ID)

#Get the result from the match from dbu result and return the fine:
#match_result = find_result("202852",dbu_season_ID)


#Print total revenue
#total_revenue = total_revenue_f()

#Print current value
#total_deposit = total_deposit_f()

#player still need to pay x kr,-
#for i,name in enumerate(mobilepay_players_list):
 #   player_need_to_pay = player_remain_to_pay(i)
  #  print(player_need_to_pay, name)


