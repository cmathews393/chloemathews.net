import ReactMarkdown from "react-markdown";
import Navbar from "@/components/Navbar";
import styles from "@/app/page.module.css";

const content = `
## High level overview

User Manager is a Flask app (eventually with a FastAPI + PostgreSQL backend) designed to simplify the process of onboarding new users to the organization. User manager objectives are:
- Standardize work
- Reduce wait states
- Improve communication


## Standardize work

This step involved communication with HR, managers, and internal engineering teams. While there was technically a written process for how to perform onboarding tasks, systems and standards change ownership and required tasks over the years, and so the document was more of a cobbled together list of tasks, in no particular order and with lots of caveats. Onboarding a new user typically took anywhere from 2 hours for a simple user setup to 4 hours for complex users or if a system/interface changed and documentation needed updating. After communicating with stakeholders, we were able to strip down a process that contained ~20-30 steps depending on role to a process that contained about 15 standard tasks with ~5 flex tasks depending on role. This additionally improved security and consistency, so users did not have access to systems they didn't need, and any two given users in the same role had identical groups in Active Directory/Entra (later just Entra) + access to platforms.

## Reduce wait states

The starting process was:
- HR submits ticket via form fill out (anywhere from 2 months to two weeks before start date)

- Various engineers (some of whom no longer had a place in the process) get assigned to the ticket

- HR waits for tasks to be completed when engineers see it and pick up the ticket

- Some engineers tasks require a previous step to be completed, and if its not, they have to wait until the previous engineer has time in their schedule to work the ticket. 

- If any questions arise during the process, it requires a back and forth between the engineer and HR (or various other departments responsible for a given tool)

- Anything that gets missed gets surfaced on employee start date

- Invites to third party systems expire and have to be resent anyway

The ending process now looks like:

- HR creates user in talent platform (Workday), setting start date, department etc in a standard way based on standard roles

- User is automatically synced over to Entra for provisioning

- Dynamic groups and conditional rules assign appropriate Microsoft licensing, department and role based groups, and start date is synced from Workday

- HR clicks a button in User Manager, fills out 2-5 fields as required that cannot be synced from/do not exist in Workday

- User Manager reads the start date from Entra, and schedules tasks to be completed at the two week mark + start date

- On two weeks mark, ticket is automatically created with relevant information. Any tasks that can be performed without a time constraint (assigning internal phone number, granting mailbox and calendar access to systems or managers, sending requests to managers to fill out hardware requisition) are performed. A Teams chat for communication is sent to relevant parties, with a link to user manager, which can be used to monitor the status of the user in various systems (via API integrations where available, and manual input by the responsible engineer everywhere else), and the user manager specific tasks.

- On start date, time sensitive tasks (e.g. timed invites etc) get sent from various systems, via API calls. Internal invites/emails get sent out with followup instructions for required manual steps. 

- All tasks and statuses are available on the user manager page to reduce the amount of back and forth ("Is Task A complete?" *wait 30-60 minutes for a response* "No, doing it now"). Utilizing an internal service catalog, each service on the status page has a note about the responsible department and SME where applicable, so managers and users know who to reach out to in case of issues.

## Improve communication

Much of the communication improvements have been discussed in the above section, but they bear repeating as communication was the biggest friction point between internal systems administration and other departments during onboarding. 

- Reduce manual communication. Automated systems send invites, send notifications, and display status updates. 
- Provide immediate communication path with a Teams chat for quick questions, to ensure everyone involved in the process is aware of any issues.
- Establish feedback loops with managers and HR to iterate and improve on the systems and automations, and report issues.


## Engineering summary

At its beginning, user manager was a simple CLI app that was designed for internal sysadmin use. The required steps were converted to API calls and triggered on demand by the sysadmin. No scheduling, no communication automation. 

The second stage was a basic flask app that did nearly the same thing as the CLI, but was accessible to HR and allowed them to create the ticket and trigger automation on their own. We utilized cloudflare (with a function wrapper on routes + SCIM mappings from Entra) to gate access to sensitive information. 

The third stage was a better looking flask app, with more streamlining of steps, and a connection to our internal API (built with FastAPI and backed by Postgres) to store state for users and onboarding tasks. This is where we enabled the status/system monitoring so that managers could interface directly with the process. 

The fourth and current stage was migration to a new UI to support the following functionality (and related backend change):
- Workday process is handled by HR. Provisioning is configured in Entra with field mappings and dynamic group assignments (managed by me with input from departments and other tool owners so we have useful RBAC groups)

- The internal API app pulls out all users in Entra and stores them in Postgres with internal fields and post processing done to map some internal distinctions that we can't do in Entra, as well as be a reference point for user lifecycle events. This allows HR to search the list for the newly provisioned user synced from workday, and trigger the onboarding process on demand

- In the backend, the API app uses APScheduler to schedule two weeks/start date tasks (with breakout mechanisms if the start date is less than two weeks out and other edge cases). 

- We integrate with 5-7 external systems via API to create accounts and set up groups/roles
`;

export default function UserManagerPage() {
  return (
    <div>
      <Navbar />
      <div className={styles.container}>
        <div className={styles.title}>
          <h1>User Manager</h1>
        </div>
        <div className={styles.card}>
          <ReactMarkdown className={`${styles.genericbody} ${styles.markdown}`}>
            {content}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  );
}
