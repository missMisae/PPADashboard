const immediateInsights = "https://us-east4-ppaloan-demo.cloudfunctions.net/getImmediateInsights"
const insightsOt = "https://us-east4-ppaloan-demo.cloudfunctions.net/getInsightsOverTime"
const susLoans = "https://us-east4-ppaloan-demo.cloudfunctions.net/getSusLoans"

export const getImmediateInsights = async () => {
    const response = await fetch(immediateInsights, {
        method: 'GET'
    });
    const jsonRes = await response.json();
    return jsonRes
}

export const getInsightsOverTime = async () => {
    const response = await fetch(insightsOt, {
        method: 'GET'
    });
    const jsonRes = await response.json();

    return jsonRes
}

export const getSusLoans = async () => {
    const response = await fetch(susLoans, {
        method: 'GET'
    });
    const jsonRes = await response.json();
    return jsonRes
}
