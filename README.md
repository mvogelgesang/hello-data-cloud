# Hello Data Cloud

A starter project containing a Salesforce Platform app, Adoption Events, and corresponding Data Cloud Data Streams.

- [Hello Data Cloud](#hello-data-cloud)
  - [Deployment](#deployment)
    - [Prerequisites](#prerequisites)
    - [1 - Base App](#1---base-app)
      - [Seed data](#seed-data)
      - [Update Page Layouts](#update-page-layouts)
      - [Data Cloud Connector Permissions](#data-cloud-connector-permissions)
        - [Scripted](#scripted)
        - [Manual](#manual)
    - [2 - Deploy Data Cloud Extension](#2---deploy-data-cloud-extension)
  - [Post Data Cloud Deployment](#post-data-cloud-deployment)
    - [Create Data Streams](#create-data-streams)
  - [Updating Data Cloud Metadata](#updating-data-cloud-metadata)
  - [Retrieveing data kit](#retrieveing-data-kit)

## Deployment

Installation takes place in three parts, the first is the base app (`force-app`) and the second is the Data Cloud extension (`data-app/`). _If deploying to a newly provisioned scratch org, the Data Cloud deployment will block the force-app installation until it is complete._ No harm in entering the first command and letting it queue.

### Prerequisites

`npm i`

### 1 - Base App

`sf project deploy start --source-dir force-app`
`sf org assign permset -n Adoption_Event_Admin`

#### Seed data

Import Contacts and Adoption Event records into the org.

`sf data import tree -p data/Contact-Adoption_Event__c-plan.json`

Create many to many association using the Adoption Event Volunteer object.

`npm run createAEVData`

If you ever need to start from scratch with the data, run `npm run deleteAEVData`. This will delete all Contact, Adoption Event, and Adoption Event Volunteer records.

#### Update Page Layouts

Setup > Object Manager > Contacts > Page Layouts > Contact Page Layout

Add Adoption Event Volunteer to the related lists section.

#### Data Cloud Connector Permissions

Update permissions for Data Cloud Salesforce Connector, this can be done manually or via a script.

##### Scripted

`sf project retrieve start -m permissionSet:sfdc_c360a_sfdctrust_permSet --output-dir tmp`

Script will look at all objects in your force-app directory and add object and field level read permissions

`npm run updateDCConnectorPerms.js`

Deploy the update back to your org

`sf project deploy start --source-dir tmp/`

Remove the tmp/ folder to avoid any confusion

`rm -rf tmp/`

##### Manual

- Setup > Permission Sets > Data Cloud Salesforce Connector
- Object Settings > Adoption Events > Edit
  - Enable all Object permissions (read, create, edit, delete, view all, modify all)
  - Enable Read access for all fields
  - Save
- Object Settings > Adoption Event Volunteer
  - Enable all Object permissions (read, create, edit, delete, view all, modify all)
  - Enable Read access for all fields
  - Save

### 2 - Deploy Data Cloud Extension

`sf project deploy start --source-dir data-app -o {YOUR NEW ORG}`

## Post Data Cloud Deployment

### Create Data Streams

Data Streams > New > Connected Sources: Salesforce CRM

Pick the AdoptionEventDK Bundle, add both Data Streams

## Updating Data Cloud Metadata

Update metadata in org, make appropriate Data Kit updates. Run the following:

## Retrieveing data kit

`sf project retrieve start -m DataSourceBundleDefinition -m DataStreamTemplate -m DataPackageKitDefinition -m DataPackageKitObject -m FieldSrcTrgtRelationship -m DataCalcInsightTemplate -m DataSourceObject -m DataSource -m DataSrcDataModelFieldMap -m CustomObject:Adoption_Event_c_00DDa000001Wc5U__dlm -m CustomObject:Adoption_Event_Volunteer_00DDa000001__dlm -o {YOUR DEV ORG} -r data-app/`
