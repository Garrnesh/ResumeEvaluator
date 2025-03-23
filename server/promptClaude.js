const Anthropic = require("@anthropic-ai/sdk");
const fetch = require('node-fetch');
const editData = require('./dataProcessing');

const anthropic = new Anthropic({
  // defaults to process.env["ANTHROPIC_API_KEY"]
  apiKey: "{INSERT API KEY HERE}",
});

async function claude(pdfBase64) {
    const now = new Date();
    const curData = now.toString();

    const msg = await anthropic.messages.create({
    model: "claude-3-7-sonnet-20250219",
    max_tokens: 20000,
    temperature: 1,
    messages: [
        {
        "role": "user",
        "content": [
            {
                type: 'document',
                source: {
                  type: 'base64',
                  media_type: 'application/pdf',
                  data: pdfBase64,
                },
              },
              
            {
            "type": "text",
            // "text": "You are a professional resume reviewer. Your task is to provide detailed feedback on a resume, analyzing it section by section and then giving an overall assessment. The resume you will be reviewing has been sent as a pdf document.\n\nPlease analyze this resume section by section. The common sections you should look for include:\n\n1. Contact Information\n2. Professional Summary or Objective\n3. Work Experience\n4. Education\n5. Skills\n6. Additional sections (e.g., Volunteer Work, Projects, Awards)\n\nFor each section present in the resume, provide feedback in the following format:\n\n<section_feedback>\n<section_name>[Name of the section]</section_name>\n<pros>[List the positive aspects of this section]</pros>\n<cons>[List any areas for improvement in this section. If there are no significant cons, state \"No major issues found.\"]</cons>\n</section_feedback>\n\nAfter reviewing all sections, provide an overall assessment of the resume:\n\n<overall_feedback>\n<overall_pros>[List the general strengths of the resume]</overall_pros>\n<overall_cons>[List the general areas for improvement. If there are no significant cons, state \"No major issues found.\"]</overall_cons>\n</overall_feedback>\n\nRemember to be constructive in your feedback, highlighting both strengths and areas for improvement. If a standard section is missing from the resume, mention it in the overall feedback as an area for improvement.\n\nBegin your analysis now, going through each section of the provided resume and then giving your overall feedback."
            "text": "You are an AI resume checker tasked with analyzing a resume and providing detailed feedback. Remember today's date is " + curData + ". Your goals are as follows\n1. You are to evaluate the design and structure of the resume, ensuring its easy to be read and follow for both recruiters and the Applicant Tracking System (ATS). Provide any positive feedback (if any) and suggest improvements (if any)\na. Use <design_analysis> tag this review\n2. Evaluate the grammar, spelling check and phrasing of all the points in the resume. Provide any positive feedback (if any) and suggest improvements if necessary (if any).\na. Use <grammar_analysis> tag this review\n3. Ensure that technical details are provided in the resume (eg. numbers and statistics etc.) and there are no repeated adjectives or verbs (for example using the word designed repeatedly etc.) Provide any positive feedback (if any) and suggest improvements (if any).\na. Use <technical_analysis> tag this review\n4. Evaluate the resume section by section\n   a. Identify the main sections of the resume\n   b. For each section, provide a brief analysis highlighting any positive feedback (if any) and suggest improvements if necessary (if any). Use <section_analysis> tags for each section's analysis.\n5. Provide general feedback of the entire resume. Provide any positive feedback (if any) and suggest improvements (if any)\na. Use <general_analysis> tag this review\n6. Assign a final score out of 100 for the entire resume\n   a. Consider factors such as the quality of the content, overall impact of the resume, design of the resume and relevance of the provided information. Before providing the score, explain your reasoning using <score_justification> tags.\n\nThe text content of the resume PDF is in the PDF sent earlier:\n\nOutput your analysis in the following format:\n\n<resume_analysis>\n  <design_analysis>\n    Positives:\n    &-& [List positive feedback]\n    Improvements:\n    &-& [List improvements]\n  </design_analysis>\n  <grammar_analysis>\n    Positives:\n    &-& [List positive feedback]\n    Improvements:\n    &-& [List improvements]\n  </grammar_analysis>\n  <technical_analysis>\n    Positives:\n    &-& [List positive feedback]\n    Improvements:\n    &-& [List improvements]\n  </technical_analysis>\n  <section_analysis>\n    [Section name]\n    Positives:\n    &-& [List positive feedback]\n    Improvements:\n    &-& [List improvements]\n  </section_analysis>\n  [Repeat <section_analysis> for each main section]\n  <general_analysis>\n    Positives:\n    &-& [List positive feedback]\n    Improvements:\n    &-& [List improvements]\n  </general_analysis>\n  <score_justification>\n    [Explain your reasoning for the final score and put in in a single paragraph]\n  </score_justification>\n  <final_score>[Provide the final score out of 100]</final_score>\n</resume_analysis>\n\nRemember to be thorough and constructive in your feedback. Remember when you provide points, if possible, to provide examples in the resume as well. Remember the symbol '&-&' is used to symbolise a new point in the output and dont generate this exact sequence anywhere else then stated."
            }
        ]
        }
    ]
    });

    console.log('Recieved results from Claude');
    const val = msg.content[0].text
    const final_data = editData(val);
    return final_data
}

module.exports = claude;