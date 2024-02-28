#!/bin/python3

from new_functions import *
import unicodedata


dbu_match_ID_list = ["193827","193831","193834","193840","193845","193847","201625","201750","201753","202852","202855","202857"]
season = "409842"

#Add all the matches to the matches database without adding information, only done once a season.
add_matches_to_database(dbu_match_ID_list,season)

#list of all dbu players
dbu_names = search_database("player_finance.json","payingPlayers","dbu_name")

#list of all players mobilepay name
mobilepay_names = search_database("player_finance.json","payingPlayers","mobilepay_name")

#list of all matches
matches_played = search_database("matches.json","matches","matchID")



# Add all players to each match      
for match in dbu_match_ID_list:
    team_lineup_in_match = find_team_lineup(match,season)
    playerlist = who_played_the_game(dbu_names,team_lineup_in_match)
    match_result = find_match_result(match,season)
    fine = calculate_fine(match_result)
    append_data_to_database(match,playerlist,len(dbu_match_ID_list),match_result,fine)


