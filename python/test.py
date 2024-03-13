import sys

def main():
    # Check if an argument is provided
    if len(sys.argv) < 2:
        print("Usage: python script.py [argument]")
        return

    # Retrieve the argument
    argument = sys.argv[1]

    # Print the argument
    print("The provided argument is:", argument)

if __name__ == "__main__":
    main()
