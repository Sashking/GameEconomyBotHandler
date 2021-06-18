const client = require('../index');
const { Collection } = require('discord.js');
const timeCollection = new Collection();
const time = 1000 * 60 * 60;

client.on('voiceStateUpdate', async (oldState, newState) => {
    //! Member joins a channel
    if (!oldState.channel && newState.channel) {
        timeCollection.set(newState.member.id, new Date());

        setTimeout(async function() {
            timeout(newState);
        }, time)
    }
    //! Member leaves a channel
    if (oldState.channel && !newState.channel) {
        timeCollection.delete(oldState.member.id);
    }
})

function timeout(newState) {
    if (timeCollection.get(newState.member.id)) {
        client.add(newState.member.id, 60, 'cash', newState);

        setTimeout(async function() {
            timeout(newState);
        }, time)
    }
}