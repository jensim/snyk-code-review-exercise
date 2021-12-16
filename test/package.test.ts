import got from 'got';
import { Server } from 'http';
import { createApp } from '../src/app';

describe('/package/:name/:version endpoint', () => {
  let server: Server;
  let port: number;

  beforeAll(() => {
    return new Promise(done => {
      server = createApp().listen(0, () => {
        const addr = server.address();
        if (addr && typeof addr === 'object') {
          port = addr.port;
          done(null);
        } else {
          done(new Error('Unexpected address ${addr} for server'));
        }
      });
    });
  });

  afterAll(() => {
    return new Promise(done => {
      server.close(done);
    });
  });

  it('responds', async () => {
    const packageName = 'react';
    const packageVersion = '16.13.0';

    const res: any = await got(
      `http://localhost:${port}/package/${packageName}/${packageVersion}`
    );
    const json = JSON.parse(res.body);

    expect(res.statusCode).toEqual(200);
    expect(json.name).toEqual(packageName);
    expect(json.version).toEqual(packageVersion);
    expect(json.dependencies).toEqual({
      'loose-envify': {
        'version': '^1.1.0',
        'dependecies': {
          'js-tokens': {
            'dependecies': {},
            'version': '^1.0.1',
          },
        },
      },
      'object-assign': {
        'version': '^4.1.1',
        'dependecies': {},
      },
      'prop-types': {
        'version': '^15.6.2',
        'dependecies': {
          'loose-envify': {
            'dependecies': {},
            'version': '^1.3.1',
          },
          'object-assign': {
            'dependecies': {},
            'version': '^4.1.1',
          },
        },
      },
    });
  });
});
