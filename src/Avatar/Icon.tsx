import { BankUser } from "../Interfaces/BankUser"
import { Image } from "react-bootstrap";

export function Icon({avatar}: {avatar: string}) {
    //Takes in the avatar string from a user to determine the profile picture to display.

    //Try catch block that'll display the user's profile picture if it exists; The default profile otherwise.
    try {
        return <Image src={require("../AvatarPool/" + avatar + ".png")} rounded style={{width: "25px", height: "25px", margin: "2px"}}></Image>
    } catch {
        return <Image src={require("../AvatarPool/default.png")} rounded style={{width: "25px", height: "25px", margin: "2px"}}></Image>
    }
}