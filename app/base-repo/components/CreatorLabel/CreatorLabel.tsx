import {capitalizeFirstLetter} from "@/lib/general/format-utils";

export function CreatorLabel({firstname, lastname}: {
    firstname: string;
    lastname?: string;
}) {
    let result = ""
    //let link = "";
    if(firstname === "SELF") {
        result += "Anonymous User";
    }else{
        result += (lastname) ? capitalizeFirstLetter(lastname) + "," : "";
        result += (firstname) ? capitalizeFirstLetter(firstname) : "";
        //link = "https://orcid.org/orcid-search/search?firstName=" + firstname + "&lastName=" + lastname;
    }

        return (
             <p>{result}</p>
        );
}
