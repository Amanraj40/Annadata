import React from 'react'
import g1 from "../../assets/donation/g1.jpg"
import g2 from "../../assets/donation/g2.webp"
import g3 from "../../assets/donation/g3.jpg"
import g4 from "../../assets/donation/g4.jpg"

const AboutDonation = () => {
    const data = [
        { title: "Registration",data:"The food donation registration process is streamlined to ensure efficiency and inclusivity. It typically begins with potential donors visiting an official website or mobile application where they can create an account. Once registered, donors fill out a detailed form specifying the type and quantity of food they intend to donate, along with any specific requirements for storage and transportation. Verification of the donor’s identity and the food's safety standards is often conducted to maintain quality and reliability. Upon approval, donors receive instructions on how and where to deliver their donations or arrange for pick-up.This is whole process of registration.  ", img: g1 },
        { title: "Seeing",data:"Food donation is a crucial process that involves the collection, sorting, and distribution of surplus food to those in need. The process typically starts with individuals, restaurants, and food manufacturers donating excess or unsellable food. This food is then transported to food banks or charitable organizations, where it undergoes a rigorous sorting process to ensure safety and quality. Volunteers play a significant role in inspecting, categorizing, and packaging the food items.Once sorted, the food is distributed to various partner agencies, such as shelters, soup kitchens, and community centers, which then provide it directly to people experiencing food insecurity.", img: g2 },
        { title: "Donation",data:"Food donation is a vital process that involves collecting surplus or donated food from various sources such as restaurants, grocery stores, and individual donors, and redistributing it to those in need through food banks, shelters, and community kitchens. The process begins with donors identifying and setting aside excess food, which is then picked up or dropped off at designated collection points. Food banks and charities sort and inspect the donations to ensure safety and quality before distributing them to beneficiaries. This process not only helps alleviate hunger and reduce food waste but also fosters a sense of community and solidarity among donors and recipients.", img: g3 },
        { title: "Save Life",data:"Food donation is a vital process that helps to alleviate hunger and reduce food wasteage across different parts of world. By providing surplus food from donors to those in need, it ensures that edible resources are used efficiently, supporting community well-being and promoting sustainability. The process typically involves collecting, sorting, and distributing food through various charitable organizations and food banks. This not only addresses immediate nutritional needs but also fosters a sense of social responsibility and collective action in the fight against food insecurity.This is the whole process of save life. This is the last process of Food Donation process.", img: g4 },
    ]
    return (
        <section className="grid place-items-center dark:text-white-900">
            <div className="container">
                <div className="text-center"><br />
                    <h2 className='text-3xl font-bold'>Donation Process</h2>
                    <code>The donation process from the time you arrive center until the time you leave</code><br /><br />
                </div>
                <div className='grid grid-cols-4 place-items-center'>
                    {data.map((e, i) =>
                        <div className='border-metal shadow-md rounded-lg overflow-hidden max-w-[90%] select-none'>
                            <img src={e.img} draggable={false} width="100%" alt="" />
                            <div className='m-4'>
                                <h1 className='font-bold text-lg text-primary'>{i + 1} - {e.title}</h1>
                                <p className='text-justify'>{e.data}</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </section>
    )
}

export default AboutDonation