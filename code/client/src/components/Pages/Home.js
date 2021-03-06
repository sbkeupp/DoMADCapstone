import React from 'react';
import './Home.css'
import bg from '../../images/home-filler-girl_running.jpg';
import bg_alt from '../../images/home-filler-inspire.jpg';
import logo_wh from '../../images/CompleteDoMADLogo.svg';
import logo_bl from '../../images/DoMADLogoDark.svg';
import StepsGraphic from '../../images/123DoMADGraphic.png';

import { FaStar } from 'react-icons/fa';
import { IconContext } from "react-icons";
import dons from '../../images/png_icons/comingSoonIcon.svg';

import { Link } from 'react-router-dom';

// see navbar file for comments on how log in/log out functionality works

var loggedin = false;

class HomeBlogInfo extends React.Component {
    constructor(props) {
		super(props)

        var tripInfo = this.props.tripInfo;

        this.state = {
            city: tripInfo.locationID.city,
            country: tripInfo.locationID.country,
            donationItem: tripInfo.donations ? tripInfo.donations[0].itemName : "None",
	        donationRating: tripInfo.donations ? tripInfo.donations[0].rating : "None",
            privatePost: tripInfo.isPrivate
        }
    }

	render() {
		return <HomeBlogEntry homeblog={this.state} />
	}
}

function HomeBlogEntry(props) {
    var star_amount;
    if(props.homeblog.donationRating === 1) {
        star_amount = <div><FaStar /></div>
    }
    else if(props.homeblog.donationRating === 2) {
        star_amount = <div><FaStar /> <FaStar /></div>
    }
    else if(props.homeblog.donationRating === 3) {
        star_amount = <div><FaStar /> <FaStar /> <FaStar /></div>
    }
    else if(props.homeblog.donationRating === 4) {
        star_amount = <div><FaStar /> <FaStar /> <FaStar /> <FaStar /></div>
    }
    else if(props.homeblog.donationRating === 5) {
        star_amount = <div><FaStar /> <FaStar /> <FaStar /> <FaStar /> <FaStar /></div>
    }

    return (
        <div className="slides-container">
            <div className="slide-entry">
                <div className="top-image">
                    <img src={ dons } alt="boulder" />
                </div>
                <div className="donation-content">
                    <div className="blog-same-line">Location:      {props.homeblog.country}</div>
                    <div className="blog-same-line">Donation Item: {props.homeblog.donationItem}</div>
                    <div className="star-blog-rating">
                        <IconContext.Provider value={{ color: "yellow", className: "global-class-name", style: { verticalAlign: "middle" } }}>
                            <div className="star-blog-rating">Rating:  {star_amount}</div>
                        </IconContext.Provider>
                    </div>
                </div>
            </div>
        </div>
    );
}

class HomeBlogContainer extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
            loading: 'true', reloadAccount: this.reload
        };
    }

    reload = () => {
        this.setState({ loading: 'true', reloadAccount: this.reload });
        this.getTrips(this)
          .then(res => {
            this.setState({
              trips: res,
              loading: 'false',
              reloadAccount: this.reload
            });
          });
      }

    getTrips = async () => {        
        const response = await fetch('/api/user/trip/all-trips');
        const data = await response.json();
        if (response.status !== 200) {
            throw Error(response.message)
        }
        return data;
    };
    
    componentDidMount() {
        this.getTrips(this)
        .then(res => {
            this.setState({
                trips: res,
                loading: 'false',
                reloadAccount: this.reload
            });
        })
      .catch(err => console.log(err)); // TODO: handle all errors and relay to user
    }

	render() {
        if(this.state.loading === 'false'){
            return <Home homeblog={this.state} />
        }
        return (
            <div>
                <Home homeblog={this.state} />
            </div>
        )
	}
}

function Home(props) {

    var trips = <div></div>

    if(props.homeblog.loading === "false"){
        var tripData = props.homeblog.trips.trips;
        trips = tripData.map(trip => {
        return <div className='blog-container-wrapper'>
            <HomeBlogInfo tripInfo={trip} />
        </div>
        });

        trips = <div className="blog-trips-container">
            {trips.reverse().slice(0,3)} {/* this reverses the order of the blogs so the newest shows first and limits the amount of blogs being shown to 3 */}
        </div>
    }

    return (
        <div className="home">
            <StickyContainer className='top-container'>
                <img id='bg_img' src={bg} alt={bg_alt} />
                <HomeNavbar />
            </StickyContainer>
            <article className='steps-wrapper'>
                <h4 className='spacer-caption'>
                    Empowering Global Travelers To Make A Difference Locally
                </h4>
                <div className='all-steps-container'>
                    <img className='steps-graphic' src={StepsGraphic} alt="Steps to donate" />
                </div>
                <h4 className='spacer-caption'>
                    Click <a className='text-hyperl' href='/how_it_works'>here</a> to learn more.
                </h4>
                <hr style={{width: '70%', margin:'0px 15%'}}/>
            </article>
            <article className='donations-wrapper'>
                <h2>Recent Donations</h2>
                <p>DoMAD requires users to be logged in to their account in order to view all user donations and travel stories.</p>
                {trips}
            </article>
        </div>
    );
}

/* Sets an Observer on the  for viewport visibility*/
function StickyContainer({ children, sticky=false, className, ...rest }){
    const [isSticky, setIsSticky] = React.useState(false);
    const ref = React.createRef();
    
    // mount observer
    React.useEffect(() => {
        const cachedRef = ref.current, 
                observer = new IntersectionObserver(
                    ([e]) => setIsSticky(e.intersectionRatio < 0.1), {
                        threshold: [0.1]
                    } 
                );
        observer.observe(cachedRef);
      
        // unmount
        return function(){ observer.unobserve(cachedRef); }
    }, [ref])
    
    return (
        <div className={className + (isSticky ? " isSticky" : "")} ref={ref} {...rest}>
            {children}
        </div>
    );
}

class HomeNavbar extends React.Component {
    constructor(props) {
        super(props);
		this.state = {
            loading: 'true', reloadAccount: this.reload
        };
    }

    reload = () => {
        this.setState({ loading: 'true', reloadAccount: this.reload });
        this.checkLoggedInStatus(this)
          .then(res => {
            this.setState({
              loading: 'false',
              reloadAccount: this.reload
            });
          });
    }

    checkLoggedInStatus = async () => {
        const response = await fetch('/api/user/auth/check-login');
        const data = await response.json();
        if (response.status === 200) {
            console.log("logged in status: ", loggedin);
            loggedin = true;
            this.setState({
                loading: 'true',
                reloadAccount: this.reload
            });
        }
        else {
            loggedin = false;
            this.setState({
                loading: 'true',
                reloadAccount: this.reload
            });
        }
        return data;
    };
    
    componentDidMount() {
        this.checkLoggedInStatus(this)
        .then(res => {
            this.setState({
                loading: 'false',
                reloadAccount: this.reload
            });
        })
      .catch(err => console.log(err)); // TODO: handle all errors and relay to user
    }

    handleLogoutClick = async () => {
        const response2 = await fetch('/api/user/auth/logout');
        loggedin = false;
        window.location.reload();
    };

    render () {
        if(loggedin === true) {
            return (
                <div>
                    <div className="navbar-wrapper">
                        <ul className='nav-list'>
                            <li className='dropdown'>
                            </li>
                            <li className='dropdown'>
                                <a id='ham-btn' href="javascript:void(0)" className="DD-btn">
                                    Profile  <i className="down-up-arrow"></i>
                                </a>
                                <div className="dropdown-content">
                                    <a href="/account">Account</a>
                                    <div onClick={this.handleLogoutClick} className="dropdown-options-home">
                                        Log Out
                                    </div>
                                </div>
                            </li>
                            <li className='dropdown'>
                                <a id='ham-btn' href="javascript:void(0)" className="DD-btn">
                                    Info  <i className="down-up-arrow"></i>
                                </a>
                                <div className="dropdown-content">
                                    <a href="/how_it_works">How It Works</a>
                                    <a href="/about">About Us</a>
                                    <a href="/faq">FAQ</a>
                                    <a href="/contact">Contact Us</a>
                                </div>
                            </li>
                        </ul>
                    </div>
                    <div className="block-wrapper">
                    <div>
                        <img id='block-logo' src={logo_wh} alt={logo_bl} />
                    </div>
                    <div id='block-content'>
                            <div id='exp' className='block-box'>
                                <a href="/search_locations">Explore</a>
                            </div>
                            <div id='blog' className='block-box'>
                                <a href="/blogs">Blogs</a> {/* if a user is not logged in the button will show register instead */}
                            </div>
                        </div>
                    </div>
                </div>
            )
        }
        else {
            return (
                <div>
                    <div className="navbar-wrapper">
                        <ul className='nav-list'>
                            <li className='dropdown'>
                            </li>
                            <li className='dropdown'>
                                <a id='ham-btn' href="javascript:void(0)" className="DD-btn">
                                    Log In  <i className="down-up-arrow"></i>
                                </a>
                                <div className="dropdown-content">
                                    <a href="/login">Log In</a>
                                    <a href="/register">Register</a>
                                </div>
                            </li>
                            <li className='dropdown'>
                                <a id='ham-btn' href="javascript:void(0)" className="DD-btn">
                                    Info  <i className="down-up-arrow"></i>
                                </a>
                                <div className="dropdown-content">
                                    <a href="/how_it_works">How It Works</a>
                                    <a href="/about">About Us</a>
                                    <a href="/faq">FAQ</a>
                                    <a href="/contact">Contact Us</a>
                                </div>
                            </li>
                        </ul>
                    </div>
                    <div className="block-wrapper">
                        <div>
                            <img id='block-logo' src={logo_wh} alt={logo_bl} />
                        </div>
                        <div id='block-content'>
                            <div id='exp' className='block-box'>
                                <a href="/search_locations">Explore</a>
                            </div>
                            <div id='blog' className='block-box'>
                                <a href="/register">Register</a> {/* this button shows if a user is not logged in, if they are it will show blogs instead */}
                            </div>
                        </div>
                    </div>
                </div>
            )
        }
    }
}

export default HomeBlogContainer;