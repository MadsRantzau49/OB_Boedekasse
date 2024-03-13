#!/bin/python3

from functions import *

dbu_match_ID_list = ["193827","193831","193834","193840","193845","193847","201625","201750","201753","202852","202855","202857"]
season = "409842"
season_start = "13/03/2024"


#list of all dbu players
dbu_names = search_database("player_finance.json","payingPlayers","dbu_name")

#list of all players mobilepay name
mobilepay_names = search_database("player_finance.json","payingPlayers","mobilepay_name")

#Add all the matches to the matches database without adding information
add_matches_to_database(dbu_match_ID_list,season)

#Reset all players economy data.
reset_fines(len(dbu_names))

update_player_deposit(mobilepay_names,season_start)

# making the matches.json file.     
for match in dbu_match_ID_list:
    team_lineup_in_match = find_team_lineup(match,season)
    playerlist = who_played_the_game(dbu_names,team_lineup_in_match)
    match_result = find_match_result(match,season)
    fine = calculate_fine(match_result)
    append_data_to_database(match,playerlist,len(dbu_match_ID_list),match_result,fine)
    update_dept(playerlist,fine,len(dbu_names))


