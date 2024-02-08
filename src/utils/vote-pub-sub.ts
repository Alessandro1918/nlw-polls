type Message = { pollOptionId: string, votes: number }  //obj with 2 keys
type Subscriber = (message: Message) => void;           //function with 1 param and without return

class VotingPubSub {
  private channels: Record<string, Subscriber[]> = {};  //list of channel ids and connections listening for it's messages

  //A connection wants to listen to this channel's messages:
  subscribe(pollId: string, subscriber: Subscriber) {
    //No one was listening to this channel's results; init array
    if (!this.channels[pollId]) {
      this.channels[pollId] = [];
    }

    this.channels[pollId].push(subscriber);
  }

  //Some route sent a new message:
  publish(pollId: string, message: Message) {
    if (!this.channels[pollId]) {
      return;
    }

    //For each connection, call the "subcriber" function, and send (publish) the received message.
    for (const subscriber of this.channels[pollId]) {
      subscriber(message)   //Message from from "/vote" route: {pollId: "fabcd45...", votes: 42}
    }
  }
}

export const voting = new VotingPubSub();