import React from "react";
import {JSONPath} from 'jsonpath-plus';
import {createLabeledField, createTag} from "../../lib/dataCardHelpers"
import {ContentInformation, DataResource, Description, Title} from "@/lib/definitions";
import DataResourceCard from "@/app/base-repo/components/DataResourceCard/DataResourceCard";
import {downloadEventIdentifier, editEventIdentifier, viewEventIdentifier} from "@/lib/event-utils";

function DataCardResultView({result, onClickLink}) {
    const TYPE_COLOR = '#1BE7FF'
    const DANGER_COLOR = '#FF5714'
    const WARN_COLOR = '#FFB800'
    const MISC_COLOR_1 = '#6EEB83'
    const MISC_COLOR_2 = '#E4FF1A'

    let title = undefined;
    let subtitle = undefined;
    let description = undefined;
    let tagsString = undefined;
    let image = "https://via.placeholder.com/100?text=placeholder"
    let textRight = undefined;
    let children = undefined;
    let actionButtonsString = undefined;

    let resource:DataResource = {} as DataResource;

    if (result._meta.rawHit._index === "metastore-sem") {
        resource.titles.push({value: result.metadataDocument.raw.entry.title} as Title);
        resource.titles.push({value: result.metadataDocument.raw.entry.instrument.instrumentName +
                " (" + result.metadataDocument.raw.entry.instrument.instrumentManufacturer.modelName + ")", type: "SUBTITLE"} as Title);

        const child:ContentInformation = {} as ContentInformation;
        child.tags.push("thumb");
        if (result.metadataDocument.raw.entry.instrument.instrumentName.toLowerCase() === "Zeiss Auriga".toLowerCase()) {
            child.contentUri = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSwSpT2dxHus_JH_3qibUP7KLIqVp_g6Nk6zFGzvsB6yg&s"
        } else if (result.metadataDocument.raw.entry.instrument.instrumentName.toLowerCase() === "ZEISS ULTRA PLUS".toLowerCase()) {
            child.contentUri  = "https://analyticalscience.wiley.com/do/10.1002/imaging.323/full/i89f6e6f648a33fdb48b0680beb740447-1700076873727.jpg"
        } else {
            child.contentUri  = "https://via.placeholder.com/100?text=Unknown%0ASEM%0ADevice"
        }

        if (JSONPath("$..entry.measurementPurpose", result.metadataDocument.raw, undefined, undefined).length) {
            resource.descriptions.push({description:result.metadataDocument.raw.entry.measurementPurpose , type: "ABSTRACT"} as Description);
        } else {
            resource.descriptions.push({description:"No purpose provided.", type: "ABSTRACT"} as Description);
        }

        /*title = createLabeledField(result.metadataDocument.raw.entry.title);

        subtitle = createLabeledField(result.metadataDocument.raw.entry.instrument.instrumentName +
            " (" + result.metadataDocument.raw.entry.instrument.instrumentManufacturer.modelName + ")",
            "");*/

        /*if (result.metadataDocument.raw.entry.instrument.instrumentName.toLowerCase() === "Zeiss Auriga".toLowerCase()) {
            image = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSwSpT2dxHus_JH_3qibUP7KLIqVp_g6Nk6zFGzvsB6yg&s"
        } else if (result.metadataDocument.raw.entry.instrument.instrumentName.toLowerCase() === "ZEISS ULTRA PLUS".toLowerCase()) {
            image = "https://analyticalscience.wiley.com/do/10.1002/imaging.323/full/i89f6e6f648a33fdb48b0680beb740447-1700076873727.jpg"
        } else {
            image = "https://via.placeholder.com/100?text=Unknown%0ASEM%0ADevice"
        }*/

       /* if (JSONPath("$..entry.measurementPurpose", result.metadataDocument.raw, undefined, undefined).length) {
            description = createLabeledField(result.metadataDocument.raw.entry.measurementPurpose)
        } else {
            description = createLabeledField("No purpose provided.")
        }*/

        let tags = []
        tags.push(createTag("SEM", TYPE_COLOR));

        if (JSONPath("$..instrument.eBeamSource.accelerationVoltage.value", result.metadataDocument.raw, undefined, undefined).length) {
            tags.push(createTag(result.metadataDocument.raw.entry.instrument.eBeamSource.accelerationVoltage.value + " kV",
                WARN_COLOR,
                'openmoji:high-voltage'));
        }

        if (JSONPath("$..instrument.stage.stageAlignmentDone", result.metadataDocument.raw, undefined, undefined).length) {
            let stageAligned = JSONPath("$..instrument.stage.stageAlignmentDone", result.metadataDocument.raw, undefined, undefined)[0];
            tags.push(createTag("StageAligned", (stageAligned) ? MISC_COLOR_2 : WARN_COLOR, 'ri:align-vertically'));
        }

        tagsString = JSON.stringify(tags);

        textRight = createLabeledField(result.metadataDocument.raw.entry.user.userName, "User");
    } else if (result._meta.rawHit._index === "metastore-general_sample") {
       /* title = createLabeledField(result.metadataDocument.raw.sampleIdentification.sampleName);
        subtitle = createLabeledField(result.metadataDocument.raw.sampleIdentification.sampleProducer, undefined, "");

        if (JSONPath("$..samplePreparation.preparationDescription", result.metadataDocument.raw, undefined, undefined).length) {
            description = createLabeledField(result.metadataDocument.raw.samplePreparation.preparationDescription);
        } else {
            description = createLabeledField("No preparation description.");
        }

        let tags = []
        tags.push(createTag("Sample", TYPE_COLOR));

        if (JSONPath("$..sampleDescription.sampleChemicalFormula", result.metadataDocument.raw, undefined, undefined).length) {
            if (JSONPath("$..sampleDescription.sampleCASNumber", result.metadataDocument.raw, undefined, undefined).length) {
                image = "https://www.chemicalbook.com/CAS/GIF/" + result.metadataDocument.raw.sampleDescription.sampleCASNumber + ".gif"
                tags.push(createTag(result.metadataDocument.raw.sampleDescription.sampleChemicalFormula, MISC_COLOR_1,
                    'simple-icons:moleculer',
                    "https://www.chemicalbook.com/Search_EN.aspx?keyword=" + result.metadataDocument.raw.sampleDescription.sampleCASNumber));
            } else {
                image = "https://via.placeholder.com/100?text=Unknown%0ACAS%0ANumber"
                tags.push(createTag(result.metadataDocument.raw.sampleDescription.sampleChemicalFormula, MISC_COLOR_1,
                    'simple-icons:moleculer',
                    "https://www.chemicalbook.com/Search_EN.aspx?keyword=" + result.metadataDocument.raw.sampleDescription.sampleChemicalFormula));
            }
        } else {
            image = "https://via.placeholder.com/100?text=Unknown%0AChemical%0AFormula"
        }

        if (JSONPath("$..sampleHandlingPrecaution.safetyInfo.hazard", result.metadataDocument.raw, undefined, undefined).length) {
            tags.push(createTag('Haz', DANGER_COLOR, 'maki:danger'));
        }
        if (JSONPath("$..sampleHandlingPrecaution.sampleHandling.gloves", result.metadataDocument.raw, undefined, undefined).length &&
            JSONPath("$..sampleHandlingPrecaution.sampleHandling.gloves", result.metadataDocument.raw, undefined, undefined)[0] === true) {
            tags.push(createTag('Gloves', WARN_COLOR, 'game-icons:gloves'));
        }

        tagsString = JSON.stringify(tags);

        textRight = createLabeledField(result.metadataDocument.raw.sampleIdentification.sampleID.sampleID, "Sample ID");*/
    } else if (result._meta.rawHit._index === "metastore-mri_schema") {
      /*  title = createLabeledField(result.metadataDocument.raw.study.studyTitle);
        subtitle = createLabeledField(result.metadataDocument.raw.study.instrument.instrumentManufacturer.manufacturerName +
            " (" + result.metadataDocument.raw.study.instrument.instrumentManufacturer.modelName + ")",
            undefined, "");

        if (result.metadataDocument.raw.study.instrument.instrumentManufacturer.modelName.toLowerCase() === "Biospec 152/11".toLowerCase()) {
            image = "https://www.bruker.com/en/products-and-solutions/preclinical-imaging/mri/biospec/bioSpec_152_11/_jcr_content/root/herostage/desktopImage.coreimg.82.731.png/1604572582360/biospec-152-11.png"
        } else {
            image = "https://via.placeholder.com/100?text=Unknown%0AMRI%0ADevice"
        }

        if (JSONPath("$..study.studyID", result.metadataDocument.raw, undefined, undefined).length) {
            description = createLabeledField("StudyID: " + result.metadataDocument.raw.study.studyID);
        } else {
            description = createLabeledField("No study id provided.");
        }

        let tags = []
        tags.push(createTag("MRI", TYPE_COLOR));

        if (JSONPath("$..study.sample.sampleWeight.value", result.metadataDocument.raw, undefined, undefined).length) {
            tags.push(createTag(result.metadataDocument.raw.study.sample.sampleWeight.value + " KG", MISC_COLOR_1, 'mdi:weight-kilogram'));
        }

        if (JSONPath("$..study.sample.measurementConditions.value", result.metadataDocument.raw, undefined, undefined).length) {
            tags.push(createTag(result.metadataDocument.raw.study.sample.measurementConditions.value + " T", WARN_COLOR, 'openmoji:high-voltage'));
        }

        tagsString = JSON.stringify(tags);

        textRight = createLabeledField(result.metadataDocument.raw.study.user.name, "User");
*/
        /*  if (JSONPath("$..study.series", result.metadataDocument.raw, undefined, undefined).length) {
                  children = result.metadataDocument.raw.study.series.map((e) => {
                      console.log(e)
                      let child = {};
                      child["dataTitle"] = e.seriesID;
                      child["subTitle"] = e.seriesTitle;
                      child["text-right"] = JSON.stringify({
                          "label": "Images",
                          "value": "Images: " + e.images.perImage.length
                      });
                      child["variant"] = "default";
                      return child;
                  })
                  children = JSON.stringify(children);
          }*/
    } else if (result._meta.rawHit._index === "baserepo") {
        resource = result.metadata.raw;
        resource.id = result.id.raw;
        resource.lastUpdate = result.lastUpdate.raw;
        resource.children = result.content;
        /*title = createLabeledField(result.metadata.raw.titles[0].value);

        subtitle = createLabeledField(result.metadata.raw.publisher, "");

        image = "https://via.placeholder.com/100?text=Unknown%0ASEM%0ADevice"

        if (JSONPath("$..entry.measurementPurpose", result.metadata.raw, undefined, undefined).length) {
            description = createLabeledField(result.metadata.raw.entry.measurementPurpose)
        } else {
            description = createLabeledField("No purpose provided.")
        }

        let tags = []
        tags.push(createTag("SEM", TYPE_COLOR));

        if (JSONPath("$..instrument.eBeamSource.accelerationVoltage.value", result.metadata.raw, undefined, undefined).length) {
            tags.push(createTag(result.metadata.raw.entry.instrument.eBeamSource.accelerationVoltage.value + " kV",
                WARN_COLOR,
                'openmoji:high-voltage'));
        }

        if (JSONPath("$..instrument.stage.stageAlignmentDone", result.metadata.raw, undefined, undefined).length) {
            let stageAligned = JSONPath("$..instrument.stage.stageAlignmentDone", result.metadata.raw, undefined, undefined)[0];
            tags.push(createTag("StageAligned", (stageAligned) ? MISC_COLOR_2 : WARN_COLOR, 'ri:align-vertically'));
        }

        tagsString = JSON.stringify(tags);

        textRight = createLabeledField(result.metadata.raw.resourceType.value, result.metadata.raw.resourceType.typeGeneral);*/
    }
   /* let actionButtons = []
    actionButtons.push(createActionButton(result.id.raw, "Show in MetaRepo", "material-symbols:pageview-outline"));
    actionButtonsString = JSON.stringify(actionButtons);
*/
    const actionEvents = [
        viewEventIdentifier(resource.id),
        editEventIdentifier(resource.id),
        downloadEventIdentifier(resource.id)
    ];

    return (
        <li className="sui-result">
            <DataResourceCard key={resource.id} data={resource} actionEvents={actionEvents}></DataResourceCard>

    {/*<DataCard
                data-title={title}
                sub-title={subtitle}
                variant="default"
                children-variant="default"
                download-url="http://test.org"
                edit-url="/elasticsearch"
                image-url={image}
                body-text={description}
                text-right={textRight}
                children-data={children}
                tags={tagsString}
                action-buttons={actionButtonsString}
            ></DataCard>*/}
        </li>
    )
}

export default DataCardResultView;
