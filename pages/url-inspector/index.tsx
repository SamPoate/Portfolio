import type { NextPage } from 'next';
import Default from '@layout/Default';
import URLInspector from '@template/url-inspector/URLInspector';

const URLInspectorPage: NextPage = () => (
    <Default>
        <URLInspector />
    </Default>
);

export default URLInspectorPage;
