import re

# Input string containing HTML entity
input_string = "Poul S&#248;nderup"

# Decode HTML entities using regular expressions
decoded_input_string = re.sub(r'&(#?\w+);', lambda m: chr(int(m.group(1)[1:], 16) if m.group(1).startswith('#x') else int(m.group(1)[1:])), input_string)

# Open the output file in write mode
with open("output.txt", "w") as f:
    # Print the decoded input string
    print("Decoded input string:", decoded_input_string, file=f)
    
    # Print whether the decoding was successful
    print("Decoding successful:", decoded_input_string == input_string, file=f)
    
    # Print the decoded string to the file
    print(decoded_input_string, file=f)
