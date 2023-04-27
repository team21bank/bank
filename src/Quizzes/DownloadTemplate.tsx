import React from "react";
import { Button } from "react-bootstrap";
//@ts-ignore

export function DownloadTemplate(): JSX.Element {

    function exportFile() {
        const exportString = `Quiz Name:,Quiz Description:,Money:,Attempts:,,,,,,
        Sample Quiz,This is a sample quiz for testing,500,3,,,,,,
        Name:,Body:,Points,Option1,Option2,Option3,Option4,Option5,Answer,Image URL
        Test1,What Pokemon has the WonderGuard ablility?,5,Greninja,Shedinja,Spiritomb,,,Shedinja,https://assets.pokemon.com/assets/cms2/img/pokedex/full/292.png
        Test2,What is your name?,5,Sir Robin,Tim,"Arthur, King of the Britons",,,"Arthur, King of the Britons",https://cdn.vox-cdn.com/thumbor/eDxTQNAywA_nPiaMuWojjoQTU80=/0x0:1920x1080/1820x1024/filters:focal(711x45:1017x351):format(webp)/cdn.vox-cdn.com/uploads/chorus_image/image/66894849/seeso_Monty_Python_And_The_Holy_Grail_Mov_Full_Image_GalleryBackground_en_US_1483993549331._RI_.0.jpg
        Test3,What is your quest?,5,To seek the Holy Grail,Become king of the pirates,Get a quirk,Make 100 friends,,To seek the Holy Grail,https://cdn.vox-cdn.com/thumbor/eDxTQNAywA_nPiaMuWojjoQTU80=/0x0:1920x1080/1820x1024/filters:focal(711x45:1017x351):format(webp)/cdn.vox-cdn.com/uploads/chorus_image/image/66894849/seeso_Monty_Python_And_The_Holy_Grail_Mov_Full_Image_GalleryBackground_en_US_1483993549331._RI_.0.jpg
        Test4,What is the airspeed velocity of an unladen swallow?,10,10 km/hr,40 furlongs/fortnitght,About two,African or European?,I don't know,African or European?,https://cdn.vox-cdn.com/thumbor/eDxTQNAywA_nPiaMuWojjoQTU80=/0x0:1920x1080/1820x1024/filters:focal(711x45:1017x351):format(webp)/cdn.vox-cdn.com/uploads/chorus_image/image/66894849/seeso_Monty_Python_And_The_Holy_Grail_Mov_Full_Image_GalleryBackground_en_US_1483993549331._RI_.0.jpg`;
        downloadBlob(
            exportString,
            `QuizTemplate.csv`,
            "text/csv;charset=utf-8;"
        );
    }

    function downloadBlob(
        content: string,
        filename: string,
        contentType: string
    ) {
        // Create a blob
        const blob = new Blob([content], { type: contentType });
        const url = URL.createObjectURL(blob);

        // Create a link to download it
        const pom = document.createElement("a");
        pom.href = url;
        pom.setAttribute("download", filename);
        pom.click();
    }

    return (
        <div>
            <Button onClick={() => exportFile()}>Download Template Quiz</Button>
        </div>
    );
}