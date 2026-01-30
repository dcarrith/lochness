import React, { useEffect } from 'react';
import { MODAL_DATA } from '../data/modalData';
import { QRCodeCanvas } from 'qrcode.react';

interface ModalProps {
    modalId: string | null;
    isOpen: boolean;
    onClose: () => void;
}

const Modal: React.FC<ModalProps> = ({ modalId, isOpen, onClose }) => {
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
            document.body.classList.add('modal-open');
        } else {
            document.body.style.overflow = '';
            document.body.classList.remove('modal-open');
        }

        return () => {
            document.body.style.overflow = '';
            document.body.classList.remove('modal-open');
        };
    }, [isOpen]);

    if (!isOpen || !modalId) return null;

    const data = MODAL_DATA[modalId];

    if (!data) {
        console.warn(`Modal data not found for id: ${modalId}`);
        return null;
    }

    const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    return (
        <div className={`modal ${isOpen ? 'active' : ''}`} style={{ display: 'block', opacity: 1 }} onClick={handleBackdropClick}>
            <div className="modal-content">
                <span className="modal-close" onClick={onClose}>&times;</span>
                <div className="modal-header">
                    <div className="modal-icon">
                        <i className={data.icon}></i>
                    </div>
                    <h3>{data.title}</h3>
                </div>
                <div className="modal-body">
                    {data.offerString && (
                        <div className="qr-code-large" style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
                            <QRCodeCanvas
                                value={data.offerString}
                                size={300}
                                level={"H"}
                                includeMargin={true}
                                fgColor={"#ffffff"}
                                bgColor={"#0a192f"}
                                imageSettings={{
                                    src: "/images/lochness-logo.png",
                                    height: 60,
                                    width: 60,
                                    excavate: true,
                                }}
                            />
                        </div>
                    )}
                    {data.content}
                </div>
                <div className="modal-footer">
                    {data.offerFileName ? (
                        <a
                            href="#"
                            className="btn btn-primary modal-cta download-offer"
                            onClick={(e) => {
                                e.preventDefault();
                                alert(`Downloading ${data.offerFileName}. In a production environment, this would download a Chia offer file that you can accept in your wallet.`);
                            }}
                        >
                            Download Offer File
                        </a>
                    ) : (
                        <a href="#contact" className="btn btn-primary modal-cta" onClick={onClose}>Get Started</a>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Modal;
