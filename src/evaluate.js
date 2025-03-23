import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { Document, Page, pdfjs } from 'react-pdf';
import loadingAnimation from './loading.lottie';
import { BsFillArrowLeftCircleFill, BsFillArrowRightCircleFill } from "react-icons/bs";
import { ImHome } from "react-icons/im";


function Evaluate() {
    const [param] = useSearchParams();
    const pdfBase64 = param.get('pdfBase64');
    const [ waiting, setWaiting ] = useState(true);
    const [claudeRes, setClaudeRes] = useState('');
    const [curPage, setCurPage] = useState(0);
    const requestSent = useRef(false);
    const navigate = useNavigate();

    useEffect(() => {
        async function claudeFetch() {
            if (requestSent.current) return;
            requestSent.current = true;
            try{
                const res = await fetch('http://localhost:3001/claude', {
                    method: 'POST',
                    headers: {
                    'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ pdfBase64 })
                });
                const claudeData = await res.json();
                console.log(claudeData);
                setClaudeRes(claudeData);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
            setWaiting(false);
            setTimeout(() => {
                requestSent.current = false;
              }, 2000);
        }
        claudeFetch();
    }, [pdfBase64]);

    if (waiting) {
        return(
            <div style={{ textAlign: 'center' }}>
                <h1>Evaluating your resume ... Please hold!</h1>
                <DotLottieReact src={loadingAnimation} loop autoplay />
            </div>
        )
    }

    const feedbackRender = [];
    feedbackRender.push({
        pageName: "Overall Score",
        pageContent: (
            <div>
                <div>
                    <h3 style={{textAlign: 'center'}}>
                        Your overall Score is
                    </h3>
                        <h3 style={{textAlign: 'center'}} >{claudeRes.final}</h3>
                </div>
                <div>
                    <p>{claudeRes.score}</p>
                </div>
            </div>
        )
    });

    feedbackRender.push({
        pageName: "General Feedback",
        pageContent: (
            <div>
                <div>
                    <h3>Positive Aspects:</h3>
                    <ul>
                        {claudeRes.general.pos.map((item, index) => (
                            <li key={index}>{item}</li>
                        ))}
                    </ul>
                </div>
                <div>
                    <h3>Areas for Improvement:</h3>
                    <ul>
                        {claudeRes.general.neg.map((item, index) => (
                            <li key={index}>{item}</li>
                        ))}
                    </ul>
                </div>
            </div>
        )
    })

    feedbackRender.push({
        pageName: "Design Feedback",
        pageContent: (
            <div>
                <div>
                    <h3>Positive Aspects:</h3>
                    <ul>
                        {claudeRes.design.pos.map((item, index) => (
                            <li key={index}>{item}</li>
                        ))}
                    </ul>
                </div>
                <div>
                    <h3>Areas for Improvement:</h3>
                    <ul>
                        {claudeRes.design.neg.map((item, index) => (
                            <li key={index}>{item}</li>
                        ))}
                    </ul>
                </div>
            </div>
        )
    })

    feedbackRender.push({
        pageName: "Technical Feedback",
        pageContent: (
            <div>
                <div>
                    <h3>Positive Aspects:</h3>
                    <ul>
                        {claudeRes.technical.pos.map((item, index) => (
                            <li key={index}>{item}</li>
                        ))}
                    </ul>
                </div>
                <div>
                    <h3>Areas for Improvement:</h3>
                    <ul>
                        {claudeRes.technical.neg.map((item, index) => (
                            <li key={index}>{item}</li>
                        ))}
                    </ul>
                </div>
            </div>
        )
    })

    feedbackRender.push({
        pageName: "Grammar/Phrasing Feedback",
        pageContent: (
            <div>
                <div>
                    <h3>Positive Aspects:</h3>
                    <ul>
                        {claudeRes.grammar.pos.map((item, index) => (
                            <li key={index}>{item}</li>
                        ))}
                    </ul>
                </div>
                <div>
                    <h3>Areas for Improvement:</h3>
                    <ul>
                        {claudeRes.grammar.neg.map((item, index) => (
                            <li key={index}>{item}</li>
                        ))}
                    </ul>
                </div>
            </div>
        )
    })

    for (let [key, value] of Object.entries(claudeRes)) {
        if (key.startsWith("section")){
            feedbackRender.push({
                pageName: value.topic,
                pageContent: (
                    <div>
                        <div>
                            <h3>Positive Aspects:</h3>
                            <ul>
                                {value.pos.map((item, index) => (
                                    <li key={index}>{item}</li>
                                ))}
                            </ul>
                        </div>
                        <div>
                        <h3>Areas for Improvement:</h3>
                            <ul>
                                {value.neg.map((item, index) => (
                                    <li key={index}>{item}</li>
                                ))}
                            </ul>
                        </div>
                    </div>
                )
            });
        }
    };

    const nextSection= () => {
        setCurPage((pre) => (pre + 1) % feedbackRender.length);
    };

    const preSection = () => {
        setCurPage((pre) => ([pre] - 1 + feedbackRender.length) % feedbackRender.length);
    };

    const dataUrl = `data:application/pdf;base64,${pdfBase64}`;

    return (
        <div style={{ padding: "20px", fontFamily: "Helvetica, Arial, sans-serif" }}>
          <h1>Resume Evaluator</h1>
          <button onClick={() => navigate('/')} style={{
                    position: 'absolute',
                    top: '30px',
                    right: '50px',
                    background: 'none',
                    border: 'none',
                    zIndex: 1000,
            }}> <ImHome size={40} /> </button>

          <div style={{ display: 'flex', height: '100vh' }}>
            <div style={{ flex: 1 }}>
                <iframe
                    src={dataUrl}
                    title="PDF Viewer"
                    width="100%"
                    height="100%"
                    frameBorder="0"
                />
            </div>
            <div
              style={{
                position: 'relative',
                boxSizing: 'border-box',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
                backgroundColor: '#f7f7f7',
                width: '50%',
                padding: '0 100px'
              }}
            >
                <button onClick={preSection} style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50px',
                    background: 'none',
                    border: 'none',
                }}> <BsFillArrowLeftCircleFill /> </button>

                <button onClick={nextSection} style={{
                    position: 'absolute',
                    top: '50%',
                    right: '50px',
                    background: 'none',
                    border: 'none',
                }}> <BsFillArrowRightCircleFill /> </button>

              <h2>{feedbackRender[curPage].pageName}</h2>
              {feedbackRender[curPage].pageContent}
                <div
                    style={{
                    position: 'absolute',
                    bottom: '50px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    fontSize: '1rem',
                    color: '#333'
                    }}
                >
                    {curPage + 1} / {feedbackRender.length}
                </div>
            </div>
          </div>
        </div>
      );
}

export default Evaluate;