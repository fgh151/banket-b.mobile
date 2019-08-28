import AS from '@react-native-community/async-storage'
import {STORAGE_FIRST_LUNCH} from "./Constants";
import {db} from "../Config";
import {getKeys} from "./ArrayHelper";
import {Notify} from "./Notify";


/**
 * @returns {Promise<any>}
 */
export function isFirstLunch() {
    return AS.getItem(STORAGE_FIRST_LUNCH);
}

/**
 *
 * @returns {Promise}
 */
export function firstLunchDone() {
    return AS.setItem(STORAGE_FIRST_LUNCH, true.toString());
}

/**
 * @returns {Promise}
 */
export function firstLunchRevert() {
    return AS.removeItem(STORAGE_FIRST_LUNCH);
}

export function initMessages(id) {
    const path = '/proposal_2/u_' + id;
    let ref = db.ref(path);
    ref.once('value', (snapshot) => {
        const value = snapshot.val();
        const proposals = getKeys(value);
        proposals.forEach(function (currentProposal, proposalIndex) {
            const organizations = getKeys(value[currentProposal]);
            organizations.forEach(function (messages, index) {
                let proposal = proposals[proposalIndex];
                let organization = organizations[index];
                let count = getKeys(value[proposal][organization]).length;
                Notify.readAllMessages(proposal, organization, count);
            })
        })
    })
}
