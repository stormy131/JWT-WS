const users = [];

const createUser = (id, username, room) => {
    const user = {id, username, room};
    users.push(user);

    return user;
};

const currentUser = id => users.find(user => user.id === id);

const disconnectUser = id => {
    const index = users.findIndex(user => user.id === id);
    if(index !== -1) return users.splice(index, 1)[0];
}

const getRoomUsers = room => users.filter(user => user.room === room);

module.exports = {
    createUser,
    currentUser,
    disconnectUser,
    getRoomUsers
};