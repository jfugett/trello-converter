'use strict';

var _ = require('lodash');
var fs = require('fs');

var trelloData = require('./trello.json');

var lists = {};

trelloData.lists.forEach(function(listData) {
  if (listData.closed) {
    return true;
  }
  lists[listData.id] = {
    id: listData.id,
    name: listData.name,
    position: listData.pos,
    cards: [],
  }
});

var cards = _.orderBy(trelloData.cards, ['position'], ['asc']);

cards.forEach(function(cardData) {
  if (cardData.closed) {
    return true;
  }

  var cardObject = {
    id: cardData.id,
    title: cardData.name,
    thumbs: cardData.badges.votes,
    position: cardData.pos,
  };

  lists[cardData.idList].cards.push(cardObject);
});

var sortedLists = _.orderBy(lists, ['position'], ['asc']);

var text = '';

sortedLists.forEach(function(obj) {
  text += obj.name;
  text += "\r\n";

  obj.cards.forEach(function(card) {
    text += card.title;
    text += "\r\n"
    text += 'thumbs: ';
    text += card.thumbs;
    text += "\r\n\r\n";
  });

  text += "\r\n\r\n\r\n";
});

fs.writeFileSync('./export.txt', text);

console.log('Conversion Complete')
