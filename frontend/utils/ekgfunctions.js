// Function to detect peaks in EKG data
export function detectPeaks(data, threshold) {
    const peaks = [];
    
    // Find peaks
    for (let i = 1; i < data.length - 1; i++) {
        if (data[i] > threshold && data[i] > data[i - 1] && data[i] > data[i + 1]) {
            peaks.push({ index: i, value: data[i] });
        }
    }
    
    // Sort peaks by value in descending order
    peaks.sort((a, b) => b.value - a.value);
    
    // Keep only the top three highest peaks
    if (peaks.length > 4) {
        peaks.splice(4);
    }
    
    // Extract indices of the top three peaks
    return peaks.map(peak => peak.index);
}



// Function to calculate RR intervals from peaks
export function calculateRRIntervals(peaks, samplingRate) {
    const rrIntervals = [];
    for (let i = 1; i < peaks.length; i++) {
        const rrInterval = Math.abs((peaks[i] - peaks[i - 1]) / samplingRate); // Convert indices to time and calculate absolute value
        rrIntervals.push(rrInterval);
    }
    return rrIntervals;
}

// Function to find maxima in EKG data
export function findMaxima(ekgData) {
    const maxima = Math.max(...ekgData);
    return maxima;
}

// Function to find minima in EKG data
export function findMinima(ekgData) {
    const minima = Math.min(...ekgData);
    return minima;
}


// Function to measure the slope of a specific segment
export function measureSegmentSlope(ekgData, peaks) {
    const slopes = [];

    for (let i = 0; i < peaks.length - 1; i++) {
        const peakIndex = peaks[i];
        const nextPeakIndex = peaks[i + 1];
        const peakValue = ekgData[peakIndex];
        const nextPeakValue = ekgData[nextPeakIndex];

        // Find the lowest point after the peak (ST segment)
        let lowestPoint = Number.MAX_SAFE_INTEGER;
        let lowestPointIndex = peakIndex;
        for (let j = peakIndex; j < nextPeakIndex; j++) {
            if (ekgData[j] < lowestPoint) {
                lowestPoint = ekgData[j];
                lowestPointIndex = j;
            }
        }

        // Find the midpoint of the decline after the next peak (T wave)
        let halfwayPointIndex = nextPeakIndex;
        let foundDownward = false;
        for (let k = nextPeakIndex; k < ekgData.length; k++) {
            if (foundDownward && ekgData[k] >= nextPeakValue) {
                halfwayPointIndex = (k + lowestPointIndex) / 2;
                break;
            }
            if (ekgData[k] < nextPeakValue) {
                foundDownward = true;
            }
        }

        // Calculate the slope between the two points
        const slope = (ekgData[halfwayPointIndex] - ekgData[lowestPointIndex]) / (halfwayPointIndex - lowestPointIndex);
        slopes.push(slope);
    }

    return slopes;
}

export function detectEKGNormalcy(data, peaks, rrIntervals, maxima) {
    const rrIntervalThresholdMin = 50;
    const rrIntervalThresholdMax = 120;
    const peakCountThreshold = 4;
    const maximaThreshold = 0.9;

    // Check RR interval criteria
    const abnormalRRIntervals = rrIntervals.some(interval => interval < rrIntervalThresholdMin || interval > rrIntervalThresholdMax);
    
    // Check peak count
    const abnormalPeakCount = peaks.length > peakCountThreshold;

    // Check for left ventricular hypertrophy
    const leftVentricularHypertrophy = maxima > maximaThreshold;

    // Determine normalcy based on criteria
    if (abnormalRRIntervals) {
        return 'Abnormal';
    } else if (abnormalPeakCount) {
        return 'Abnormal';
    } else if (leftVentricularHypertrophy) {
        return 'Left Ventricular Hypertrophy';
    } else {
        return 'Normal';
    }
}
