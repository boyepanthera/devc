const toDay = (data) => {
    if (data.periodType === 'days') {
        return data.timeToElapse;
    } else if (data.periodType === 'weeks') {
        return data.timeToElapse * 7;
    } else if (data.periodType === 'months') {
        return data.periodType*30
    }
}
const covid19ImpactEstimator = (data) => {  
    const  {reportedCases, totalHospitalBeds} = data;
    const  {avgDailyIncomePopulation} = data.region;

    const currentlyInfected, infectionsByRequestedTime;

    const impact =  ()=> {
        currentlyInfected = reportedCases * 10;
        infectionsByRequestedTime =  Math.trunc(currentlyInfected * 2 ** (toDay(data)/3));
        severeCasesByRequestedTime = Math.trunc(0.15 * infectionsByRequestedTime);
        hospitalBedsByRequestedTime = Math.trunc(0.35 * totalHospitalBeds - severeCasesByRequestedTime);
        casesForICUByRequestedTime = Math.trunc(infectionsByRequestedTime * 0.15);
        casesForVentilatorsByRequestedTime = Math.trunc(infectionsByRequestedTime * 0.02);
        dollarsInFlight = Math.trunc(infectionsByRequestedTime * avgDailyIncomePopulation * avgDailyIncomeInUSD / (toDay(data)))
    }

    const severeImpact = () => {
        currentlyInfected = Math.trunc(reportedCases *50);
        infectionsByRequestedTime = Math.trunc(currentlyInfected * 2 ** (toDay(data) / 3));
        severeCasesByRequestedTime = Math.trunc(0.15 * infectionsByRequestedTime);
        hospitalBedsByRequestedTime = Math.trunc(0.35 * totalHospitalBeds - severeCasesByRequestedTime);
        casesForICUByRequestedTime = Math.trunc(infectionsByRequestedTime * 0.15)
        casesForVentilatorsByRequestedTime = Math.trunc(infectionsByRequestedTime * 0.02)
        dollarsInFlight = Math.trunc(infectionsByRequestedTime * avgDailyIncomePopulation * avgDailyIncomeInUSD / (toDay(data)))
    }

    return {
        impact,
        severeImpact
    }
};

export default covid19ImpactEstimator
