const _ = require('lodash');
const axios = require('axios');
const format = require('date-fns/format');

const { SLACK_HOOK_URL, SLACK_CHANNEL } = process.env;

exports.sendPersonioEvents = (day, dayOfYear, events) => {
    const headerText = getHeaderText(day, dayOfYear);    
    const eventMessage = getEventsMessage(events);
    const fullMessage = `${headerText}\n\n${eventMessage}`;

    // console.log(fullMessage);

    const block = {
        type: 'section',
        text: {
            type: 'mrkdwn',
            text: fullMessage,
        },
        // accessory: {
        //     type: 'image',
        //     image_url: dayOfYear.imageUrl,
        //     alt_text: dayOfYear.title
        // }
    };

    if (SLACK_HOOK_URL) {
        sendSlackBlocks([block]);
    }
};

const getHeaderText = (day, dayOfYear) => {
    // const dayOfTheYearLink = `<${dayOfYear.href}|${dayOfYear.title}>`;
    // return `*${format(day, 'dddd Do of MMMM')}* - ${dayOfTheYearLink}`;
    return `*${format(day, 'dddd, Do of MMMM')}*`;
};

const getEventsMessage = events => {
    if (!events.length) {
        return "Today there are no events in Personio's calendar\n";
    }
    let customGroups = customGroup(events, "ABSENT")
    const eventGroups = _.groupBy(customGroups, 'calendarId');    

    return Object.keys(eventGroups).reduce((message, calendarId) => {
        const groupTitle = getEventTypeMessage(calendarId);
        
        if (!groupTitle) {
            return message;
        }
        const people = eventGroups[calendarId]
            .map(event => {
                if (event.start.getTime() === event.end.getTime()) {
                    return `> ${event.name}`;
                }
                return `> ${event.name} [${formatDate(event.start)} - ${formatDate(event.end)}]`;
            })
            .join('\n');

        return `${message}${groupTitle}\n${people}\n\n`;
    }, '');
};

const formatDate = date => format(date, 'MMMM Do');

const sendSlackBlocks = blocks => axios.post(SLACK_HOOK_URL, {
    channel: SLACK_CHANNEL,
    text: '',
    blocks,
});

const customGroup = (events, groupName) => {
    const groupCalendars = process.env[`GROUP_${groupName}`]
    if (!groupCalendars) return events
    return events.map( event => {
        if (groupCalendars.includes(event.calendarId)) {
            event.calendarId = groupName
        }
        return event
    })
}

const getEventTypeMessage = calendarId => process.env[`PERSONIO_MESSAGE_${calendarId}`];


//https://api.slack.com/reference/surfaces/formatting#block-formatting

//•