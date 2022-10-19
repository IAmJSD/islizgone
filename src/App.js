import React from 'react';

class ElapsedSinceDoom extends React.Component {
  constructor() {
    super();
    const f = this.setDate.bind(this);
    this.lizFuckyWucky = (new Date("09/08/2022 16:00")).getTime();
    this.state = {now: Date.now(), tickerId: setInterval(f, 1000)};
  }

  setDate() {
    this.setState({now: Date.now()});
  }

  componentWillUnmount() {
    clearInterval(this.state.tickerId);
  }

  render() {
    // Sub the PM date from the current date.
    const diff = this.state.now - this.lizFuckyWucky;

    // Get the parts to render.
    const parts = [];

    // Get the amount of days.
    const days = Math.floor(diff / 86400000);
    if (days !== 0) parts.push(`${days} days`);

    // Get the amount of hours.
    const hours = Math.floor(diff / 3600000) % 24;
    if (hours !== 0) parts.push(`${hours} hour${hours !== 1 ? "s" : ""}`);

    // Get the amount of minutes.
    const minutes = Math.floor(diff / 60000) % 60;
    if (minutes !== 0) parts.push(`${minutes} minute${minutes !== 1 ? "s" : ""}`);

    // Get the amount of seconds.
    const seconds = Math.floor(diff / 1000) % 60;
    if (seconds !== 0) parts.push(`${seconds} second${seconds !== 1 ? "s" : ""}`);

    // Format the string.
    const last = parts.pop();
    let text = parts.join(", ");
    if (text === "") text = last;
    else text += ` and ${last}`;

    // Return the stringified information.
    return <h2>{text}</h2>;
  }
}

function InformationPanel() {
  return <aside>
    <h3>Why is her premiership so bad?</h3>
    <p>
      Liz Truss has already made many destructive u-turns during her premiership. A recent example was needing to
      u-turn on her decision to reduce tax for the wealthy by doing excess borrowing. This lead to the collapse of the
      pound until the Bank of England stepped in to rescue pension funds. Another example is her recent vote on fracking,
      with both Theresa May and Boris Johnson abstaining from the vote and many other people in the Conservative party
      joining them. Liz Truss also has an approval rating under Prince Andrew according to some polls.
    </p>

    <h3>But there is nobody better in the party to replace her?</h3>
    <p>
      This is the only reason she is still in the cabinet. Until the Tories find a replacement, they are effectively using
      the country as a hostage to keep her in the cabinet. This is a very dangerous game to play during turbulant times such
      as right now.
    </p>
  </aside>;
}

export default class App extends React.Component {
  // Constructs the class.
  constructor() {
    // Load the base class.
    super();

    // There are 4 resignation dates.
    // undefined = not loaded, null = not happened yet, 0 = server error, Date = she's gone
    this.state = {resignationDate: undefined};

    // Get the information every second.
    const f = this.getResignationInfo.bind(this);
    f();
    setInterval(f, 1000);
  }

  // Get the resignation info.
  async getResignationInfo() {
    try {
      const res = await fetch("/api/v1/resigned");
      if (!res.ok) throw new Error();
      const json = await res.json();
      this.setState({resignationDate: json ? new Date(json) : json});
    } catch (_) {
      this.setState({resignationDate: 0});
    }
  }

  // Render the page.
  render() {
    // Render the live part.
    let el;
    switch (this.state.resignationDate) {
      case undefined: {
        el = <main>
          <h1>Loading...</h1>
        </main>;
        break;
      }
      case 0: {
        el = <main>
          <h1>I can't figure out if she resigned.</h1>
          <p>There's an issue either your end or my end. This should change in a few seconds when I can update.</p>
        </main>;
        break;
      }
      case null: {
        el = <main>
          <h1>Liz has not resigned yet.</h1>
          <p>Time elapsed since Liz Truss became PM and started her destructive path:</p>
          <br />
          <ElapsedSinceDoom />
        </main>;
        break;
      }
      default: {
        const dateTimeFormat = new Intl.DateTimeFormat('en', { year: 'numeric', month: 'long', day: '2-digit' }) 
        const [{ value: month },,{ value: day },,{ value: year }] = dateTimeFormat.formatToParts(this.state.resignationDate);
        el = <main>
          <h1>🦀 LIZ IS GONE 🦀</h1>
          <p>Liz Truss resigned on <b>{day} {month} {year}</b>.</p>
          <br />
          <iframe src="https://www.youtube.com/embed/LDU_Txk06tM?autoplay=1&amp;t=74" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
        </main>;
      }
    }

    // Return the rendered app.
    return <div className="App">
      <span style={{textAlign: "center"}}>
        {el}
      </span>
      <hr />
      <InformationPanel />
      <hr />
      <aside style={{textAlign: 'center'}}>
        <p>
          <a href="https://jakegealer.me">Personal Website</a> | <a href="https://github.com/JakeMakesStuff/islizgone">GitHub Repository</a>
        </p>
      </aside>
    </div>;
  }
}
