import capitalize from "@mui/utils/capitalize";

export function CreatorLabel({firstname, lastname}: {
    firstname: string;
    lastname?: string;
}) {
    let result = ""
    let link = "";
    if(firstname === "SELF") {
        result += "Anonymous User";
    }else{
        result += (lastname) ? capitalize(lastname) + "," : "";
        result += (firstname) ? capitalize(firstname) : "";
        link = "https://orcid.org/orcid-search/search?firstName=" + firstname + "&lastName=" + lastname;
    }

        return (
            link ?  <a href={link} target={"_blank"}>{result}</a> : <p>{result}</p>
        );
}
