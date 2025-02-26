const TimeSelector = ({ onTimeChange }) => {
    const [showPopup, setShowPopup] = React.useState(false);
    const [time, setTime] = React.useState({ hours: '00', minutes: '00', seconds: '00' });
    const [isNegative, setIsNegative] = React.useState(false);
    const popupRef = React.useRef(null);
    const inputRef = React.useRef(null);

    // Handle clicks outside popup
    React.useEffect(() => {
        const handleClickOutside = (event) => {
            if (popupRef.current && !popupRef.current.contains(event.target) &&
                !inputRef.current.contains(event.target)) {
                setShowPopup(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Format time object into string
    const formatTimeString = () => {
        return `${isNegative ? '-' : ''}${time.hours}:${time.minutes}:${time.seconds}`;
    };

    // Update parent component
    React.useEffect(() => {
        if (onTimeChange) {
            onTimeChange(formatTimeString());
        }
    }, [time, isNegative]);

    const handleTimeChange = (e) => {
        const value = e.target.value;
        if (value.startsWith('-')) {
            setIsNegative(true);
        } else {
            setIsNegative(false);
        }
        
        const timeMatch = value.replace('-', '').match(/^(\d{0,2}):?(\d{0,2}):?(\d{0,2})$/);
        if (timeMatch) {
            const [, h, m, s] = timeMatch;
            setTime({
                hours: h.padStart(2, '0'),
                minutes: m.padStart(2, '0'),
                seconds: s.padStart(2, '0')
            });
        }
    };

    const adjustValue = (field, delta) => {
        const limits = { hours: 99, minutes: 59, seconds: 59 };
        const currentValue = parseInt(time[field]) || 0;
        let newValue = currentValue + delta;
        
        if (newValue < 0) newValue = limits[field];
        if (newValue > limits[field]) newValue = 0;
        
        setTime({
            ...time,
            [field]: newValue.toString().padStart(2, '0')
        });
    };

    const toggleNegative = () => {
        setIsNegative(!isNegative);
    };

    const NumberSelector = ({ value, onIncrement, onDecrement, onChange, label, max }) => {
        const [isEditing, setIsEditing] = React.useState(false);
        const [tempValue, setTempValue] = React.useState(value);
        const inputRef = React.useRef(null);
        const containerRef = React.useRef(null);
    
        const handleClick = (e) => {
            // Prevent click handling differences based on position
            e.stopPropagation();
            setIsEditing(true);
        };
    
        const handleValueChange = (e) => {
            let newValue = e.target.value;
            // Allow any numeric input
            newValue = newValue.replace(/\D/g, '');
            setTempValue(newValue);
        };
    
        const finalizeValue = () => {
            const numValue = parseInt(tempValue || '0');
            const finalValue = Math.min(numValue, max);
            onChange(finalValue.toString().padStart(2, '0'));
            setTempValue(finalValue.toString().padStart(2, '0'));
            setIsEditing(false);
        };
    
        const handleBlur = () => {
            finalizeValue();
        };
    
        const handleKeyPress = (e) => {
            if (e.key === 'Enter') {
                finalizeValue();
            }
        };
    
        React.useEffect(() => {
            if (isEditing && inputRef.current) {
                inputRef.current.focus();
                inputRef.current.select();
            }
        }, [isEditing]);
    
        React.useEffect(() => {
            if (!isEditing) {
                setTempValue(value);
            }
        }, [value, isEditing]);
    
        return (
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                padding: '8px'
            }}>
                <button 
                    onClick={onIncrement}
                    style={{
                        width: '60px',
                        height: '45px',
                        background: '#1e3a8a',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px 4px 0 0',
                        cursor: 'pointer',
                        fontSize: '24px'
                    }}>
                    ▲
                </button>
                <div 
                    ref={containerRef}
                    onClick={handleClick}
                    style={{
                        width: '60px',
                        height: '50px',
                        background: '#1e3a8a',
                        color: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontFamily: 'monospace',
                        fontSize: '24px',
                        border: '1px solid #2563eb',
                        cursor: 'text',
                        padding: 0,
                        margin: 0,
                        position: 'relative'
                    }}
                >
                    {isEditing ? (
                        <input
                            ref={inputRef}
                            type="text"
                            value={tempValue}
                            onChange={handleValueChange}
                            onBlur={handleBlur}
                            onKeyPress={handleKeyPress}
                            style={{
                                width: '100%',
                                height: '100%',
                                background: '#1e3a8a',
                                color: 'white',
                                border: 'none',
                                textAlign: 'center',
                                fontFamily: 'monospace',
                                fontSize: '24px',
                                padding: 0,
                                margin: 0,
                                outline: 'none'
                            }}
                        />
                    ) : (
                        <div style={{
                            width: '100%',
                            height: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            {value}
                        </div>
                    )}
                </div>
                <button 
                    onClick={onDecrement}
                    style={{
                        width: '60px',
                        height: '45px',
                        background: '#1e3a8a',
                        color: 'white',
                        border: 'none',
                        borderRadius: '0 0 4px 4px',
                        cursor: 'pointer',
                        fontSize: '24px'
                    }}>
                    ▼
                </button>
                <div style={{
                    fontSize: '14px',
                    marginTop: '4px',
                    color: 'white'
                }}>{label}</div>
            </div>
        );
    };

    return (
        <div style={{ position: 'relative' }}>
            <input
                ref={inputRef}
                type="text"
                value={formatTimeString()}
                onChange={handleTimeChange}
                onClick={() => setShowPopup(true)}
                className="time-input"
                placeholder="HH:MM:SS"
                style={{
                    fontSize: '24px',
                    padding: '12px 20px',
                    width: '200px',
                    textAlign: 'center'
                }}
            />
            
            {showPopup && (
                <div 
                    ref={popupRef}
                    style={{
                        position: 'absolute',
                        marginTop: '8px',
                        padding: '20px',
                        backgroundColor: '#0f2557',
                        borderRadius: '8px',
                        boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
                        zIndex: 50,
                        left: '50%',
                        transform: 'translateX(-50%)',
                        minWidth: '360px',
                        border: '1px solid #2563eb'
                    }}
                >
                    <button
                        onClick={toggleNegative}
                        style={{
                            marginBottom: '20px',
                            padding: '12px 20px',
                            borderRadius: '4px',
                            width: '100%',
                            border: 'none',
                            cursor: 'pointer',
                            backgroundColor: isNegative ? '#dc2626' : '#16a34a',
                            color: 'white',
                            fontWeight: 'bold',
                            fontSize: '18px'
                        }}
                    >
                        {isNegative ? 'Countdown Mode (-) ' : 'Count Up Mode (+)'}
                    </button>
                    
                    <div style={{ 
                        display: 'flex', 
                        justifyContent: 'center', 
                        gap: '16px',
                        alignItems: 'center'
                    }}>
                        <NumberSelector
                            value={time.hours}
                            onIncrement={() => adjustValue('hours', 1)}
                            onDecrement={() => adjustValue('hours', -1)}
                            onChange={(value) => setTime({...time, hours: value})}
                            label="Hours"
                            max={99}
                        />
                        <div style={{ fontSize: '32px', color: 'white', paddingBottom: '32px' }}>:</div>
                        <NumberSelector
                            value={time.minutes}
                            onIncrement={() => adjustValue('minutes', 1)}
                            onDecrement={() => adjustValue('minutes', -1)}
                            onChange={(value) => setTime({...time, minutes: value})}
                            label="Minutes"
                            max={59}
                        />
                        <div style={{ fontSize: '32px', color: 'white', paddingBottom: '32px' }}>:</div>
                        <NumberSelector
                            value={time.seconds}
                            onIncrement={() => adjustValue('seconds', 1)}
                            onDecrement={() => adjustValue('seconds', -1)}
                            onChange={(value) => setTime({...time, seconds: value})}
                            label="Seconds"
                            max={59}
                        />
                    </div>
                </div>
            )}
            
            <input 
                type="hidden" 
                id="timeInput" 
                value={formatTimeString()} 
            />
        </div>
    );
};

// Mount the component
ReactDOM.render(
    <TimeSelector onTimeChange={(time) => {
        document.getElementById('timeInput').value = time;
    }}/>,
    document.getElementById('time-selector-root')
);