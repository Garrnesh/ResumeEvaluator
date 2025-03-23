const fs = require('fs').promises;

function extractTextSection(str, start, end) {
    const si = str.indexOf(start)
    if (end!=-1) {
        const ei = str.indexOf(end)
        return str.substring(si + start.length, ei).trim()
    } else {
        return str.substring(si + start.length).trim()
    }
}

function extractPoints(str, search) {
    const points = [];
    let startIndex = str.indexOf(search);
    let endIndex = startIndex;
    while (startIndex!=-1) {
        endIndex = str.indexOf(search, startIndex+1);
        if (endIndex==-1) {
            point = str.substring(startIndex + search.length).trim();
        } else {
            point = str.substring(startIndex + search.length, endIndex).trim();
        }
        points.push(point);
        startIndex = endIndex;
    }
    return points
}

function extractTextInside(str) {
    // Extract Positives
    positive_str = extractTextSection(str, 'Positives:', 'Improvements:');
    improvment_str = extractTextSection(str, 'Improvements:', -1);

    pos_points = extractPoints(positive_str, '&-&');
    imp_points = extractPoints(improvment_str, '&-&');

    return [pos_points, imp_points]
}

function sectionAnalysis(store, str) {
    const section_start = '<section_analysis>';
    const section_end = '</section_analysis>';

    let startIndex = str.indexOf(section_start);
    let et, pos, neg, topic;
    let count = 0;
    while(startIndex!=-1) {
        let endIndex = str.indexOf(section_end, startIndex+1);
        et = str.substring(startIndex, endIndex).trim();
        let midIndex = et.indexOf('Positives:');
        topic = et.substring(section_start.length, midIndex).trim();

        [pos, neg] = extractTextInside(et.substring(midIndex));
        key = 'section' + count.toString();
        if (!store[key]) {
            store[key] = {};
        }
        store[key]['topic'] = topic;
        store[key]['pos'] = pos;
        store[key]['neg'] = neg;
        count = count + 1;
        startIndex = str.indexOf(section_start, endIndex);
    }
    return store
}

async function editData(val) {
    final_store = {}
    const similar_sections = ['<design_analysis>', '<grammar_analysis>', '<technical_analysis>', '<general_analysis>']
    const special_sections = ['<score_justification>', '<final_score>']
    
    for (let i = 0; i < similar_sections.length; i++) {
        let section = similar_sections[i];
        let endSection = section[0] + '/' + section.slice(1);

        let et, pos, neg;
        et = extractTextSection(val, section, endSection);
        [pos, neg] = extractTextInside(et);
        let index = section.indexOf('_');
        let key = section.slice(1, index);
        if (!final_store[key]) {
            final_store[key] = {};
        }
        final_store[key]['pos'] = pos;
        final_store[key]['neg'] = neg;
    }

    for (let i = 0; i < special_sections.length; i++) {
        let section = special_sections[i];
        let endSection = section[0] + '/' + section.slice(1);

        let et;
        et = extractTextSection(val, section, endSection);

        let index = section.indexOf('_');
        let key = section.slice(1, index);
        if (!final_store[key]) {
            final_store[key] = {};
        }
        final_store[key] = et;
    }
    final_store = sectionAnalysis(final_store, val)
    const jsonOutput = JSON.stringify(final_store, null, 2);
    await fs.writeFile('testOutput.json', jsonOutput);

    return final_store
}

module.exports = editData;