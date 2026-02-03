import React from 'react';
import Calculator from '../components/Calculator';

export interface ModalData {
    title: string;
    icon: string;
    content: React.ReactNode;
    offerString?: string;
    offerFileName?: string;
}

const OFFER_DATA = {
    'farm-specialist': 'offer1qqr83wcuu2rykcmqvpsxvgqqemhmlaekcenaj0z6xn0q0kesdmk4k9rw6ks8wh4jd0verjl8h7xsj5jqmq4c80dz2vph4an4hnxdgxqgr83wcuu2rykcmqvpsxzgqqemhmlaekcenaj0z6xn0q0kesdmk4k9rw6ks8wh4jd0verjl8h7xsj5jqmq4c80dz2vph4an4hnxdgxzgr83wcuu2rykcmqvpsxzgqqemhmlaekcenaj0z6xn0q0kesdmk4k9rw6ks8wh4jd0verjl8h7xsj5jqmq4c80dz2vph4an4hnxdgx',
    'chialisp-dev': 'offer1qqp83wcuu2rykcmqvpsxzgqqwmnhflakkcenaj0z6xn0q0kesdmk4k9rw6ks8wh4jd0verjl8h7xsj5jqmq4c80dz2vph4an4hnxdgxqgp83wcuu2rykcmqvpsxzgqqwmnhflakkcenaj0z6xn0q0kesdmk4k9rw6ks8wh4jd0verjl8h7xsj5jqmq4c80dz2vph4an4hnxdgxzgp83wcuu2rykcmqvpsxzgqqwmnhflakkcenaj0z6xn0q0kesdmk4k9rw6ks8wh4jd0verjl8h7xsj5jqmq4c80dz2vph4an4hnxdgx',
    'security-audit': 'offer1qqz83wcuu2rykcmqvpsxzgqqymnhflakkcenaj0z6xn0q0kesdmk4k9rw6ks8wh4jd0verjl8h7xsj5jqmq4c80dz2vph4an4hnxdgxqgz83wcuu2rykcmqvpsxzgqqymnhflakkcenaj0z6xn0q0kesdmk4k9rw6ks8wh4jd0verjl8h7xsj5jqmq4c80dz2vph4an4hnxdgxzgz83wcuu2rykcmqvpsxzgqqymnhflakkcenaj0z6xn0q0kesdmk4k9rw6ks8wh4jd0verjl8h7xsj5jqmq4c80dz2vph4an4hnxdgx',
    'datalayer-architect': 'offer1qqv83wcuu2rykcmqvpsxzgqqemhmlaekcenaj0z6xn0q0kesdmk4k9rw6ks8wh4jd0verjl8h7xsj5jqmq4c80dz2vph4an4hnxdgxqgv83wcuu2rykcmqvpsxzgqqemhmlaekcenaj0z6xn0q0kesdmk4k9rw6ks8wh4jd0verjl8h7xsj5jqmq4c80dz2vph4an4hnxdgxzgv83wcuu2rykcmqvpsxzgqqemhmlaekcenaj0z6xn0q0kesdmk4k9rw6ks8wh4jd0verjl8h7xsj5jqmq4c80dz2vph4an4hnxdgx',
    'aiops-engineer': 'offer1qqq83wcuu2rykcmqvpsxzgqqwmnhflakkcenaj0z6xn0q0kesdmk4k9rw6ks8wh4jd0verjl8h7xsj5jqmq4c80dz2vph4an4hnxdgxqgq83wcuu2rykcmqvpsxzgqqwmnhflakkcenaj0z6xn0q0kesdmk4k9rw6ks8wh4jd0verjl8h7xsj5jqmq4c80dz2vph4an4hnxdgxzgq83wcuu2rykcmqvpsxzgqqwmnhflakkcenaj0z6xn0q0kesdmk4k9rw6ks8wh4jd0verjl8h7xsj5jqmq4c80dz2vph4an4hnxdgx',
    'infrastructure-specialist': 'offer1qqy83wcuu2rykcmqvpsxzgqqemhmlaekcenaj0z6xn0q0kesdmk4k9rw6ks8wh4jd0verjl8h7xsj5jqmq4c80dz2vph4an4hnxdgxqgy83wcuu2rykcmqvpsxzgqqemhmlaekcenaj0z6xn0q0kesdmk4k9rw6ks8wh4jd0verjl8h7xsj5jqmq4c80dz2vph4an4hnxdgxzgy83wcuu2rykcmqvpsxzgqqemhmlaekcenaj0z6xn0q0kesdmk4k9rw6ks8wh4jd0verjl8h7xsj5jqmq4c80dz2vph4an4hnxdgx'
};

export const MODAL_DATA: Record<string, ModalData> = {
    // Service Modals
    'modal-farm-monitoring': {
        title: 'AI-Powered Farm Monitoring',
        icon: 'fas fa-robot',
        content: (
            <>
                <p>Our AI-powered farm monitoring solution provides continuous oversight of your Chia farming operations with intelligent anomaly detection and automated response systems.</p>

                <h4>Key Features:</h4>
                <ul>
                    <li><strong>Real-time Monitoring:</strong> Track harvester response times, plot validation rates, and network connectivity.</li>
                    <li><strong>Predictive Maintenance:</strong> AI algorithms predict potential hardware failures before they impact your farming.</li>
                    <li><strong>Automated Responses:</strong> Set up custom triggers and automated actions when issues are detected.</li>
                    <li><strong>Performance Analytics:</strong> Detailed dashboards showing historical performance and optimization opportunities.</li>
                    <li><strong>Multi-farm Management:</strong> Monitor and manage multiple farming operations from a single dashboard.</li>
                </ul>

                <h4>Benefits:</h4>
                <ul>
                    <li>Increase farming efficiency by up to 30%</li>
                    <li>Reduce downtime with proactive issue detection</li>
                    <li>Optimize hardware resource allocation</li>
                    <li>Maximize XCH rewards through consistent operation</li>
                </ul>
            </>
        )
    },
    'modal-chialisp-security': {
        title: 'Chialisp Security',
        icon: 'fas fa-shield-alt',
        content: (
            <>
                <p>Our Chialisp security services provide advanced protection and threat detection to safeguard your Chia smart contracts and blockchain infrastructure from vulnerabilities.</p>

                <h4>Key Features:</h4>
                <ul>
                    <li><strong>Smart Contract Auditing:</strong> Comprehensive code reviews to identify security vulnerabilities.</li>
                    <li><strong>Formal Verification:</strong> Mathematical proof of contract correctness and security properties.</li>
                    <li><strong>Penetration Testing:</strong> Simulated attacks to identify potential exploits before deployment.</li>
                    <li><strong>Security Monitoring:</strong> Continuous monitoring of on-chain activity for suspicious patterns.</li>
                    <li><strong>Incident Response:</strong> Rapid response team to address and mitigate security breaches.</li>
                </ul>

                <h4>Benefits:</h4>
                <ul>
                    <li>Protect digital assets from theft and exploitation</li>
                    <li>Build user trust with verified secure contracts</li>
                    <li>Reduce risk of financial losses due to code vulnerabilities</li>
                    <li>Ensure compliance with security best practices</li>
                </ul>
            </>
        )
    },
    'modal-farming-analytics': {
        title: 'Farming Predictive Analytics',
        icon: 'fas fa-chart-line',
        content: (
            <>
                <p>Our farming predictive analytics service leverages machine learning to forecast farming yields, optimize plot management, and prevent downtime in your Chia farming operation.</p>

                <h4>Key Features:</h4>
                <ul>
                    <li><strong>Yield Forecasting:</strong> AI-powered predictions of expected XCH rewards based on farm size and network conditions.</li>
                    <li><strong>Plot Optimization:</strong> Analysis of plot quality and recommendations for optimal k-size distribution.</li>
                    <li><strong>Network Trend Analysis:</strong> Track and predict changes in netspace to adjust farming strategy.</li>
                    <li><strong>Resource Allocation:</strong> Optimize hardware resources based on performance data.</li>
                    <li><strong>Competitive Benchmarking:</strong> Compare your farm's performance against industry averages.</li>
                </ul>

                <h4>Benefits:</h4>
                <ul>
                    <li>Make data-driven decisions about farm expansion</li>
                    <li>Identify and address performance bottlenecks</li>
                    <li>Optimize capital expenditure based on ROI predictions</li>
                    <li>Maximize farming efficiency through continuous improvement</li>
                </ul>

                <Calculator />
            </>
        )
    },
    'modal-smart-contracts': {
        title: 'Smart Contract Operations',
        icon: 'fas fa-cogs',
        content: (
            <>
                <p>Our smart contract operations service streamlines Chia smart contract development with intelligent automation, testing frameworks, and deployment optimization.</p>

                <h4>Key Features:</h4>
                <ul>
                    <li><strong>Chialisp Development:</strong> Expert development of custom smart contracts for your specific use case.</li>
                    <li><strong>Automated Testing:</strong> Comprehensive test suites to ensure contract reliability and security.</li>
                    <li><strong>CI/CD Integration:</strong> Streamlined deployment pipelines for efficient updates and maintenance.</li>
                    <li><strong>Performance Optimization:</strong> Fine-tuning of contract code for maximum efficiency and minimum cost.</li>
                    <li><strong>Contract Monitoring:</strong> Real-time monitoring of contract performance and usage patterns.</li>
                </ul>

                <h4>Benefits:</h4>
                <ul>
                    <li>Accelerate development timelines</li>
                    <li>Reduce development costs through automation</li>
                    <li>Ensure contract reliability and security</li>
                    <li>Simplify maintenance and updates</li>
                </ul>
            </>
        )
    },
    'modal-rapid-application-development': {
        title: 'Rapid Application Development',
        icon: 'fas fa-database',
        content: (
            <>
                <p>Our DataLayer Rapid Application Development service provides AI-powered tools for building decentralized applications utilizing Chia DataLayer for secure, immutable data storage and management.</p>

                <h4>Key Features:</h4>
                <ul>
                    <li><strong>Low-Code Development:</strong> Visual development tools to accelerate DataLayer application creation.</li>
                    <li><strong>AI-Generated Code:</strong> Automated generation of DataLayer integration code based on application requirements.</li>
                    <li><strong>Data Modeling:</strong> Optimized data structures for efficient on-chain storage and retrieval.</li>
                    <li><strong>API Integration:</strong> Seamless connection between DataLayer and existing systems.</li>
                    <li><strong>Scalability Planning:</strong> Architecture design for applications that can grow with your user base.</li>
                </ul>

                <h4>Benefits:</h4>
                <ul>
                    <li>Reduce development time by up to 70%</li>
                    <li>Lower technical barriers to DataLayer adoption</li>
                    <li>Create truly decentralized applications with immutable data</li>
                    <li>Future-proof your data architecture</li>
                </ul>
            </>
        )
    },
    // Enterprise Modals
    'modal-enterprise-provenance': {
        title: 'Enterprise Provenance',
        icon: 'fas fa-fingerprint',
        content: (
            <>
                <p>Our enterprise provenance solutions leverage Chia's sustainable blockchain to create immutable records for supply chain tracking, product authentication, and regulatory compliance.</p>

                <h4>Key Features:</h4>
                <ul>
                    <li><strong>Supply Chain Tracking:</strong> End-to-end visibility of products from origin to consumer.</li>
                    <li><strong>Product Authentication:</strong> Verifiable digital certificates of authenticity for physical goods.</li>
                    <li><strong>Regulatory Compliance:</strong> Automated record-keeping for audit and compliance requirements.</li>
                    <li><strong>ERP Integration:</strong> Seamless connection with existing enterprise systems.</li>
                    <li><strong>Consumer Verification:</strong> User-friendly tools for customers to verify product authenticity.</li>
                </ul>

                <h4>Benefits:</h4>
                <ul>
                    <li>Combat counterfeiting and fraud</li>
                    <li>Build consumer trust through transparency</li>
                    <li>Simplify compliance reporting</li>
                    <li>Leverage blockchain without high energy costs</li>
                </ul>
            </>
        )
    },
    'modal-infrastructure-as-code': {
        title: 'Infrastructure as Code',
        icon: 'fas fa-server',
        content: (
            <>
                <p>Our Infrastructure as Code service provides automated deployment and management of Chia blockchain infrastructure using modern IaC tools, ensuring consistency, scalability, and disaster recovery.</p>

                <h4>Key Features:</h4>
                <ul>
                    <li><strong>Automated Deployment:</strong> Terraform and Ansible scripts for consistent Chia node deployment.</li>
                    <li><strong>Configuration Management:</strong> Version-controlled infrastructure configurations.</li>
                    <li><strong>Scaling Solutions:</strong> Auto-scaling architectures for farming and full node operations.</li>
                    <li><strong>Disaster Recovery:</strong> Automated backup and recovery procedures for critical blockchain data.</li>
                    <li><strong>Multi-environment Management:</strong> Consistent deployment across development, testing, and production environments.</li>
                </ul>

                <h4>Benefits:</h4>
                <ul>
                    <li>Reduce infrastructure management overhead</li>
                    <li>Ensure consistent deployment across all environments</li>
                    <li>Minimize downtime through automated recovery</li>
                    <li>Scale operations efficiently as needs grow</li>
                </ul>
            </>
        )
    },
    'modal-performance-optimization': {
        title: 'Performance Optimization',
        icon: 'fas fa-tachometer-alt',
        content: (
            <>
                <p>Our performance optimization service provides comprehensive analysis and tuning of Chia nodes, farming operations, and smart contracts to maximize throughput, minimize latency, and reduce resource usage.</p>

                <h4>Key Features:</h4>
                <ul>
                    <li><strong>Performance Auditing:</strong> Detailed analysis of current system performance and bottlenecks.</li>
                    <li><strong>Hardware Optimization:</strong> Recommendations for optimal hardware configurations based on workload.</li>
                    <li><strong>Network Tuning:</strong> Optimization of network settings for maximum blockchain synchronization speed.</li>
                    <li><strong>Database Optimization:</strong> Tuning of blockchain databases for faster queries and reduced storage requirements.</li>
                    <li><strong>Load Testing:</strong> Stress testing of systems to identify breaking points and capacity limits.</li>
                </ul>

                <h4>Benefits:</h4>
                <ul>
                    <li>Reduce operational costs through efficient resource usage</li>
                    <li>Improve response times for critical operations</li>
                    <li>Increase system capacity without additional hardware</li>
                    <li>Enhance overall system reliability under load</li>
                </ul>
            </>
        )
    },
    // Enterprise Feature Modals (reusing content or creating specific)
    'modal-supply-chain': {
        title: 'Supply Chain Traceability',
        icon: 'fas fa-route',
        content: (
            <>
                <p>Track products from origin to consumer with immutable blockchain records. Our solution integrates with existing ERP systems and provides real-time visibility across your entire supply chain.</p>
                <ul>
                    <li>Real-time location tracking</li>
                    <li>Condition monitoring (temperature, humidity)</li>
                    <li>Chain of custody verification</li>
                    <li>Automated compliance checks</li>
                </ul>
            </>
        )
    },
    'modal-product-authentication': {
        title: 'Product Authentication',
        icon: 'fas fa-certificate',
        content: (
            <>
                <p>Combat counterfeiting with blockchain-verified product authenticity. Each product receives a unique digital identity on the Chia blockchain that consumers can verify instantly.</p>
                <ul>
                    <li>Unique digital twins for physical products</li>
                    <li>NFC/QR code integration</li>
                    <li>Consumer mobile app verification</li>
                    <li>Anti-counterfeiting analytics</li>
                </ul>
            </>
        )
    },
    'modal-regulatory-compliance': {
        title: 'Regulatory Compliance',
        icon: 'fas fa-file-contract',
        content: (
            <>
                <p>Simplify compliance reporting with automated, tamper-proof record keeping. Our solutions help meet requirements for industries including pharmaceuticals, food safety, and luxury goods.</p>
                <ul>
                    <li>Automated audit trails</li>
                    <li>Regulatory reporting generation</li>
                    <li>Data integrity verification</li>
                    <li>Secure document storage</li>
                </ul>
            </>
        )
    },
    'modal-sustainable-blockchain': {
        title: 'Sustainable Blockchain',
        icon: 'fas fa-leaf',
        content: (
            <>
                <p>Unlike energy-intensive blockchains, Chia's proof of space and time consensus mechanism provides enterprise-grade security with minimal environmental impact.</p>
                <ul>
                    <li>99% lower energy consumption than PoW</li>
                    <li>Carbon credit tokenization</li>
                    <li>ESG compliance reporting</li>
                    <li>Green infrastructure solutions</li>
                </ul>
            </>
        )
    },
    'modal-case-study-1': {
        title: 'Global Foods Inc. Case Study',
        icon: 'fas fa-utensils',
        content: (
            <>
                <div className="case-study-image" style={{ marginBottom: '20px' }}>
                    <img src="https://images.unsplash.com/photo-1542838132-92c53300491e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&h=300&q=80" alt="Global Foods Inc." style={{ width: '100%', borderRadius: '8px' }} />
                </div>
                <h4>Challenge</h4>
                <p>Global Foods Inc. faced issues with supply chain opacity and inability to quickly trace contamination sources for their organic produce line.</p>
                <h4>Solution</h4>
                <p>We implemented a farm-to-table traceability system using Chia DataLayer to record every step of the produce journey.</p>
                <h4>Results</h4>
                <ul>
                    <li>Reduced recall time from days to minutes</li>
                    <li>Increased consumer trust by 45%</li>
                    <li>Premium pricing justification for verified organic products</li>
                </ul>
            </>
        )
    },
    'modal-case-study-2': {
        title: 'LuxBrands Case Study',
        icon: 'fas fa-gem',
        content: (
            <>
                <div className="case-study-image" style={{ marginBottom: '20px' }}>
                    <img src="https://images.unsplash.com/photo-1588117260148-b47818741c74?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&h=300&q=80" alt="LuxBrands" style={{ width: '100%', borderRadius: '8px' }} />
                </div>
                <h4>Challenge</h4>
                <p>LuxBrands was losing millions annually to high-quality counterfeits that were indistinguishable from genuine products by consumers.</p>
                <h4>Solution</h4>
                <p>We created a digital identity system where each luxury item is paired with a unique NFT on the Chia blockchain.</p>
                <h4>Results</h4>
                <ul>
                    <li>Reduced counterfeit products by 80%</li>
                    <li>Secondary market royalty enforcement</li>
                    <li>Direct-to-consumer engagement channel</li>
                </ul>
            </>
        )
    },
    // Contract Specialist Modals
    'modal-farm-specialist': {
        title: 'Chia Farm Specialist',
        icon: 'fas fa-tractor',
        content: (
            <>
                <p>Our Chia Farm Specialists are experts in optimizing farming operations to maximize efficiency and rewards.</p>

                <h4>Expertise:</h4>
                <ul>
                    <li>Farm setup and configuration optimization</li>
                    <li>Harvester response time improvement</li>
                    <li>Plot management and quality assessment</li>
                    <li>Hardware resource allocation</li>
                    <li>Monitoring system implementation</li>
                </ul>

                <h4>Contract Details:</h4>
                <div className="contract-details-table">
                    <div className="detail-row">
                        <div className="detail-label">Rate:</div>
                        <div className="detail-value">15 XCH per hour</div>
                    </div>
                    <div className="detail-row">
                        <div className="detail-label">Minimum Term:</div>
                        <div className="detail-value">40 hours</div>
                    </div>
                    <div className="detail-row">
                        <div className="detail-label">Availability:</div>
                        <div className="detail-value">Within 72 hours of contract acceptance</div>
                    </div>
                    <div className="detail-row">
                        <div className="detail-label">Deliverables:</div>
                        <div className="detail-value">Performance assessment report, optimization recommendations, implementation assistance</div>
                    </div>
                </div>

                <h4>Specialist Profile:</h4>
                <div className="specialist-profile">
                    <p>All Farm Specialists have at least 2 years of professional Chia farming experience and have managed farms of 500+ plots. They are certified in Lochness AIOps methodologies and have a proven track record of improving farm efficiency.</p>
                </div>
            </>
        ),
        offerString: OFFER_DATA['farm-specialist'],
        offerFileName: 'farm-specialist.offer'
    },
    'modal-chialisp-developer': {
        title: 'Chialisp Developer',
        icon: 'fas fa-code',
        content: (
            <>
                <p>Our Chialisp Developers are experts in creating efficient, secure smart contracts for the Chia blockchain.</p>

                <h4>Expertise:</h4>
                <ul>
                    <li>Custom smart contract development</li>
                    <li>Optimization of existing contracts</li>
                    <li>Integration with external systems</li>
                    <li>Testing and deployment</li>
                    <li>Documentation and knowledge transfer</li>
                </ul>

                <h4>Contract Details:</h4>
                <div className="contract-details-table">
                    <div className="detail-row">
                        <div className="detail-label">Rate:</div>
                        <div className="detail-value">21 XCH per hour</div>
                    </div>
                    <div className="detail-row">
                        <div className="detail-label">Minimum Term:</div>
                        <div className="detail-value">40 hours</div>
                    </div>
                    <div className="detail-row">
                        <div className="detail-label">Availability:</div>
                        <div className="detail-value">Within 72 hours of contract acceptance</div>
                    </div>
                    <div className="detail-row">
                        <div className="detail-label">Deliverables:</div>
                        <div className="detail-value">Source code, documentation, test cases, deployment assistance</div>
                    </div>
                </div>

                <h4>Specialist Profile:</h4>
                <div className="specialist-profile">
                    <p>All Chialisp Developers have contributed to multiple production Chia applications and have deep understanding of CLVM. They follow secure coding practices and are experienced in developing various types of smart contracts including NFTs, DeFi applications, and custom solutions.</p>
                </div>
            </>
        ),
        offerString: OFFER_DATA['chialisp-dev'],
        offerFileName: 'chialisp-dev.offer'
    },
    'modal-security-auditor': {
        title: 'Security Auditor',
        icon: 'fas fa-shield-alt',
        content: (
            <>
                <p>Our Security Auditors specialize in identifying vulnerabilities and security risks in Chialisp smart contracts and Chia blockchain applications.</p>

                <h4>Expertise:</h4>
                <ul>
                    <li>Comprehensive code review</li>
                    <li>Vulnerability assessment</li>
                    <li>Attack vector analysis</li>
                    <li>Security best practices implementation</li>
                    <li>Formal verification</li>
                </ul>

                <h4>Contract Details:</h4>
                <div className="contract-details-table">
                    <div className="detail-row">
                        <div className="detail-label">Rate:</div>
                        <div className="detail-value">17 XCH per hour</div>
                    </div>
                    <div className="detail-row">
                        <div className="detail-label">Minimum Term:</div>
                        <div className="detail-value">15 hours</div>
                    </div>
                    <div className="detail-row">
                        <div className="detail-label">Availability:</div>
                        <div className="detail-value">Within 2 business days of contract acceptance</div>
                    </div>
                    <div className="detail-row">
                        <div className="detail-label">Deliverables:</div>
                        <div className="detail-value">Detailed audit report, vulnerability assessment, remediation recommendations</div>
                    </div>
                </div>

                <h4>Specialist Profile:</h4>
                <div className="specialist-profile">
                    <p>All Security Auditors have backgrounds in cybersecurity and blockchain security. They have performed audits on multiple Chia projects and are skilled in identifying common and obscure vulnerabilities in Chialisp code. Many hold security certifications and have experience with formal verification methods.</p>
                </div>
            </>
        ),
        offerString: OFFER_DATA['security-audit'],
        offerFileName: 'security-audit.offer'
    },
    'modal-datalayer-architect': {
        title: 'DataLayer Architect',
        icon: 'fas fa-database',
        content: (
            <>
                <p>Our DataLayer Architects design and implement secure, scalable decentralized data solutions using Chia DataLayer.</p>

                <h4>Expertise:</h4>
                <ul>
                    <li>DataLayer schema design</li>
                    <li>On-chain vs off-chain data strategy</li>
                    <li>Data replication and persistence</li>
                    <li>Integration with traditional databases</li>
                    <li>Privacy and permissioning</li>
                </ul>

                <h4>Contract Details:</h4>
                <div className="contract-details-table">
                    <div className="detail-row">
                        <div className="detail-label">Rate:</div>
                        <div className="detail-value">25 XCH per hour</div>
                    </div>
                    <div className="detail-row">
                        <div className="detail-label">Minimum Term:</div>
                        <div className="detail-value">20 hours</div>
                    </div>
                    <div className="detail-row">
                        <div className="detail-label">Availability:</div>
                        <div className="detail-value">Within 5 business days</div>
                    </div>
                    <div className="detail-row">
                        <div className="detail-label">Deliverables:</div>
                        <div className="detail-value">Architecture diagrams, data schemas, verification strategy, proof of concept</div>
                    </div>
                </div>

                <h4>Specialist Profile:</h4>
                <div className="specialist-profile">
                    <p>DataLayer Architects have deep expertise in distributed systems and the Chia DataLayer specification. They have designed solutions for carbon registries, supply chain tracking, and digital identity systems.</p>
                </div>
            </>
        ),
        offerString: OFFER_DATA['datalayer-architect'],
        offerFileName: 'datalayer-architect.offer'
    },
    'modal-aiops-engineer': {
        title: 'AIOps Engineer',
        icon: 'fas fa-brain',
        content: (
            <>
                <p>Our AIOps Engineers specialize in applying artificial intelligence to blockchain operations, automating monitoring, and optimizing performance.</p>

                <h4>Expertise:</h4>
                <ul>
                    <li>Machine learning for anomaly detection</li>
                    <li>Automated remediation scripts</li>
                    <li>Predictive maintenance models</li>
                    <li>Log analysis and pattern recognition</li>
                    <li>Dashboard creation and visualization</li>
                </ul>

                <h4>Contract Details:</h4>
                <div className="contract-details-table">
                    <div className="detail-row">
                        <div className="detail-label">Rate:</div>
                        <div className="detail-value">22 XCH per hour</div>
                    </div>
                    <div className="detail-row">
                        <div className="detail-label">Minimum Term:</div>
                        <div className="detail-value">30 hours</div>
                    </div>
                    <div className="detail-row">
                        <div className="detail-label">Availability:</div>
                        <div className="detail-value">Within 72 hours</div>
                    </div>
                    <div className="detail-row">
                        <div className="detail-label">Deliverables:</div>
                        <div className="detail-value">Custom ML models, monitoring dashboards, automation scripts, performance reports</div>
                    </div>
                </div>

                <h4>Specialist Profile:</h4>
                <div className="specialist-profile">
                    <p>AIOps Engineers combine expertise in Data Science and DevOps. They have experience deploying ML models in production environments and deep knowledge of blockchain node operations.</p>
                </div>
            </>
        ),
        offerString: OFFER_DATA['aiops-engineer'],
        offerFileName: 'aiops-engineer.offer'
    },
    'modal-infrastructure-specialist': {
        title: 'Infrastructure Specialist',
        icon: 'fas fa-network-wired',
        content: (
            <>
                <p>Our Infrastructure Specialists build and maintain robust physical and cloud infrastructure for enterprise-grade Chia operations.</p>

                <h4>Expertise:</h4>
                <ul>
                    <li>High-availability node clusters</li>
                    <li>Storage system architecture (NAS/glusterFS)</li>
                    <li>Network securty and DDoS protection</li>
                    <li>Containerization (Docker/Kubernetes)</li>
                    <li>Geographically distributed plotting</li>
                </ul>

                <h4>Contract Details:</h4>
                <div className="contract-details-table">
                    <div className="detail-row">
                        <div className="detail-label">Rate:</div>
                        <div className="detail-value">18 XCH per hour</div>
                    </div>
                    <div className="detail-row">
                        <div className="detail-label">Minimum Term:</div>
                        <div className="detail-value">40 hours</div>
                    </div>
                    <div className="detail-row">
                        <div className="detail-label">Availability:</div>
                        <div className="detail-value">Within 1 week</div>
                    </div>
                    <div className="detail-row">
                        <div className="detail-label">Deliverables:</div>
                        <div className="detail-value">Infrastructure design, deployment scripts (Terraform/Ansible), disaster recovery plan</div>
                    </div>
                </div>

                <h4>Specialist Profile:</h4>
                <div className="specialist-profile">
                    <p>Infrastructure Specialists have 5+ years of systems administration experience. They are experts in Linux system tuning, storage protocols, and network architecture optimized for peer-to-peer blockchain traffic.</p>
                </div>
            </>
        ),
        offerString: OFFER_DATA['infrastructure-specialist'],
        offerFileName: 'infrastructure-specialist.offer'
    }
};
