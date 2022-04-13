// Selects the textElement in the window, and sets it to the id='text' in index.html
const textElement = document.getElementById('text')
// Selects the optionButtons in the window, and sets it to the id='option-buttons' in index.html
const optionButtonsElement = document.getElementById('option-buttons')

// This starts as an empty state, and will keep track of items the player has on them
// throughout the game, unlocking optional choices and dialogs the play wouldn't have
// otherwise
let state = {}

// Starts the game, and sets the state and app to where it needs to be at the beginning
function startGame() {
    // This starts the game with the empty state from above.
    state = {}
    // This shows the first textNode at the games start.
    showTextNode(1)
}

// This functions will display what set of options we are currently on and display
// the correct amount of options available.
function showTextNode(textNodeIndex) {
    
    // This takes in the current textNode we want to show according to the id given.
    const textNode = textNodes.find(textNode => textNode.id === textNodeIndex)

        // This will show the text of the current textNode
        textElement.innerText = textNode.text

        // This will remove all the options, to clear the textNode for the coming new options.
        while (optionButtonsElement.firstChild) {
            optionButtonsElement.removeChild(optionButtonsElement.firstChild)
        }
        
        // This will add the new options by looping through all of our new ids options, this is
        // where nodes can be checked if they should or should no be shown depending on the state
        // (inventory).   
        textNode.options.forEach(option => {
            // Passes showOption to the function below to decide if a choice should be shown or not.
            if (showOption(option)) {
                // This will be ran only if the option passed the showOption function below.
                // Creates a button
                const button = document.createElement('button')
                // Puts the option.text inside the button
                button.innerText = option.text
                // Ensures the button is styled properly through the class set in index.html and 
                // styles set in styles.css
                button.classList.add('btn')
                // listens for click and passes in the option being selected into the selectOption
                // function below
                button.addEventListener('click', () => selectOption(option))
                // Appends the button so they are viewable by the player
                optionButtonsElement.appendChild(button)
            }
        })
}

// 
function showOption(option) {
    // Returns that if the option does not have a requiredState (== null) or it does and the player has
    // the required item, both options will show as true, and will make the choice viewable.
    return option.requiredState == null || option.requiredState(state)
}

// This will be called everytime we select an option, so we know what option has been chosen
// and will take that option.
function selectOption(option) {
    // This sets nextTextNodeId as the 'nextText: #' stated below in the objects.
    const nextTextNodeId = option.nextText
    // If our next textNodeId is less than or equil to 0, this will return startGame(), and reset from 
    // textNode 1 (the beginning of the game.)
    if (nextTextNodeId <= 0) {
        return startGame()
    }
    // Takes our current 'state', add everything from option.setState to it, and override anything
    // that is already there. So if Item1 is true in the 'state' but false in the option.setState
    // it will return a brand new object in our current state, being Item1 is false.
    state = Object.assign(state, option.setState)
    // Lastly this will show the textNode for the next window, using nextTextNodeId
    showTextNode(nextTextNodeId)
}

// This holds the defined textNodes (objects) inside of a string.
const textNodes = [
    {
        // This sets the textNodes id so they can be linked accordingly to progress through the adventure.
        id: 1,
        
        // Descriptive text to be displayed to give the player an idea of what their surroundings
        // or situation might be.
        text: 'Text for id 1 goes here.',
        
        // This edits what each button option will say, updates the players state, and links
        // to the next option using the choice the player makes to proceed.
        options: [
            {
                // Text to describe the action options the player has in this moment.
                text: 'Take Item',
                
                // Some options may change the players state (inventory).
                setState: { Item1: true },
                
                // This chooses what the next textNode options will be displayed from this choice.
                nextText: 2
            },
            {
                text: 'Leave Item',
                nextText: 2
            }
        ]
    },
    {
        id: 2,
        text: 'Text for id 2 goes here.',
        options: [
            {
                text: 'Trade item for NewItem',
                // requiredState takes in the players currentState and check if they have what they need
                // to display this option, if they do not this option will not be shown.
                requiredState: (currentState) => currentState.Item1,
                // Sets the new state, here they player traded an item, and gained a new item. the traded
                // item becomes false, while the newly aquired item becomes true. 
                setState: { Item1: false, NewItem: true },
                nextText: 3
            },
            {
                text: 'Trade item OldItem',
                requiredState: (currentState) => currentState.Item1,
                setState: { Item1: false, OldItem: true },
                nextText: 3
            },
            {
                text: 'Ignore trade',
                nextText: 3
            }
        ]
    },
    {
        id: 3,
        text: 'Text for id 3 goes here.',
        options: [
            {
                text: 'Explore',
                nextText: 4
            },
            {
                text: 'Find',
                nextText: 5
            },
            {
                text: 'Search',
                nextText: 6
            }
        ]
    },
    {
        id: 4,
        text: 'Game Over',
        options: [
            {
                text: 'Restart',
                // A nextText of -1 will signify to the app that we want to restart the game.
                nextText: -1
            }
        ]
    }
]

// This calls the startGame function above as soon as the page loads to start the game.
startGame()