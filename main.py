from my_functions import *


#list of all active players dbu name:
dbu_players_list = dbu_names()

#list of all active players mobilepay name:
mobilepay_players_list = mobilepay_names()

#List of all matches__________________________________________________________________________________________
dbu_match_ID = ["193827","193831","193834","193840","193845","193847","201625","201750","201753","202852","202855","202857","202864"]
dbu_season_ID = "409842"

#Get all active players in the match from dbu lineup
team_lineup = find_players_in_lineup("193827",dbu_season_ID,dbu_players_list)

#Get the result from the match from dbu result:
match_result = find_result("202852",dbu_season_ID)
# RESET ALL PLAYER FINANCE JSON dept and deposit 
reset_fines(dbu_players_list)
print("TEST2")
