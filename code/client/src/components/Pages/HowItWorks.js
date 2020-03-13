import React from 'react';
import './HowItWorks.css';
import Map from '../../images/Map.png'
import PackedBagPic from '../../images/PackedBagPic.png'
import RecentTravelStoryPic from '../../images/RecentTravelStoryPic.png'
import HowItWorksSearchBar from '../../images/HowItWorksSearchBar.png'
import Step1 from '../../images/Step1.png'
import Step2 from '../../images/Step2.png'
import Step3 from '../../images/Step3.png'


function HowItWorks() {
    return (
        <div className="how">

            <h1 className="how"> How It Works</h1>

            <div className="rightImg">
                <img className="howMap" src={Map} width="450" alt="Image"/>
            </div>

            <div className="rightImg2">
                <img class="howSearchBar" src={HowItWorksSearchBar} width="450" alt="Image"/>
            </div>

            <div className="leftStep1">
                <img className="step1" src={Step1} width="450" alt="Image"/>
            </div>

            < div className="divLeft">                
                <p className="origin"> 
                <h1>&emsp; &emsp;Gather Info</h1>
                &emsp; &emsp; &emsp; After planning a trip, visit DoMAD.org before traveling to gather information on what 
                items are needed for the area you are visiting. For example, if you are planning to go trekking in Peru, 
                you would consult DoMAD before departing, enter your trekking location and learn that tarps and rain 
                ponchos are most needed items in that area.
                <p>DoMAD provides suggested items for travelers to donate at their travel destination.  In many parts 
                of the developing world, items that are relatively inexpensive for most international travelers -- 
                soap, bandages, flashlights, tarps and reading glasses -- are not readily available or affordable.</p>
                </p>
            </div>

            <div className="leftImg">
                <img className="howPacking" src={PackedBagPic} width="450" alt="Image"/>
            </div>

            <div className="rightStep2">
                <img className="step2" src={Step2} width="450" alt="Image"/>
            </div>

            <div className="divr">
                <p className="origin"> 
                <h1>&emsp; &emsp;Pack Items</h1>
                &emsp; &emsp; &emsp; Based on this data, pack a few extra items to be donated to local organizations or directly to 
                the local community when you arrive. Make sure to check with your destination’s embassy and your 
                airline to avoid traveling with forbidden items. 
                <p>For example, if you are going to a country in Sub-Saharan Africa, you could bring a mosquito 
                net in your luggage to donate, or you could buy your donation item upon arrival at your destination 
                to help support the local economy.  Your donation can be 
                given directly to an individual or to a local organization.</p>
                </p>
            </div>

            <div className="rightImg3">
                <img className="howTravel" src={RecentTravelStoryPic} width="450" alt="Image"/>
            </div>

            <div className="leftStep3">
                <img className="step3" src={Step3} width="450" alt="Image"/>
            </div>

            <div className="divl">
                <p className="origin">
                <h1>&emsp; &emsp;Share your Trip</h1>
                &emsp; &emsp; &emsp; Visit DoMAD.org after your trip to provide feedback regarding your experience.
                This includes providing feedback on whether the donation item was benficial, 
                recommending a different donation item, or providing other travelers with helpful information!
                <p>DoMAD does not ask for (or accept) monetary contributions – we do ask you to share your travel experiences!  
                We need your donation ideas and experiences to inspire other travelers to give back when they travel.</p>  
                </p>
            </div> 
         
            <div className="bluePadding">
                <p className="downCenter" >If even a small percentage of the ~ 1.24 billion people who travel internationally each year donated
                 a needed item at their destination, it would help enhance the quality of life for a substantial number of people.</p>

            </div>
            
        </div>
    )
}

export default HowItWorks;