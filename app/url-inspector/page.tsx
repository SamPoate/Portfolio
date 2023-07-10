'use client';
import { useState } from 'react';
import axios from 'axios';
import Input from '@element/input/Input';
import Button from '@element/button/Button';
import styles from './URLInspector.module.scss';

interface URLInspectorProps {}

const URLInspector: React.FC<URLInspectorProps> = ({}) => {
    const [url, setUrl] = useState<string>('');

    const submit = async () => {
        try {
            const response = await axios.get('https://www.googleapis.com/pagespeedonline/v5', {
                data: {
                    url
                }
            });

            console.log(response.data);
        } catch (error) {}
    };

    return (
        <main className={styles.main}>
            <h1>Search a URL (TESTING)</h1>
            <section>
                <div className={styles.search}>
                    <Input
                        label='URL to inspect'
                        placeholder='https://www.sampoate.com/'
                        value={url}
                        onChange={({ target }) => setUrl(target.value)}
                    />
                    <Button buttonType='secondary' onClick={submit}>
                        Search
                    </Button>
                </div>
                <div className={styles.results}></div>
            </section>
        </main>
    );
};

export default URLInspector;
