import AS from "@react-native-community/async-storage";

export function getOrganizationMessagesStorageKey(proposal, organization) {
    return 'count_prop_' + proposal + '_o_' + organization;
}

export function getProposalMessagesStorageKey(proposal) {
    return 'count_prop_' + proposal
}

export function setMessagesCount(proposal, organization, count) {
    const key = getOrganizationMessagesStorageKey(proposal, organization);
    AS.getItem(key).then(oldCount => {
        AS.setItem(key, count.toString());
        const proposalKey = getProposalMessagesStorageKey(proposal);
        AS.getItem(proposalKey).then(current => {
            let value = count;
            if (current !== null) {
                value = value - parseInt(oldCount) + parseInt(current);
            }
            AS.setItem(proposalKey, value.toString());
        })
    })
}