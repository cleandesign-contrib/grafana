import { RichHistoryQuery } from '../../types';
import { SortOrder } from '../utils/richHistoryTypes';

import RichHistoryRemoteStorage, { RichHistoryRemoteStorageDTO } from './RichHistoryRemoteStorage';
import { DataSourceSrvMock } from './RichHistoryStorage';

const getMock = jest.fn();
jest.mock('@grafana/runtime', () => ({
  ...jest.requireActual('@grafana/runtime'),
  getBackendSrv: () => ({
    get: getMock,
  }),
  getDataSourceSrv: () => DataSourceSrvMock,
}));

describe('RichHistoryRemoteStorage', () => {
  let storage: RichHistoryRemoteStorage;

  beforeEach(() => {
    storage = new RichHistoryRemoteStorage();
  });

  it('returns list of query history items', async () => {
    const expectedViewModel: RichHistoryQuery<any> = {
      id: '123',
      createdAt: 200 * 1000,
      datasourceUid: 'uid',
      datasourceName: 'name-of-uid',
      starred: true,
      comment: 'comment',
      queries: [{ foo: 'bar ' }],
    };
    const returnedDTOs: RichHistoryRemoteStorageDTO[] = [
      {
        uid: expectedViewModel.id,
        createdAt: expectedViewModel.createdAt / 1000,
        datasourceUid: expectedViewModel.datasourceUid,
        starred: expectedViewModel.starred,
        comment: expectedViewModel.comment,
        queries: expectedViewModel.queries,
      },
    ];
    getMock.mockReturnValue({
      result: {
        queryHistory: returnedDTOs,
      },
    });
    const search = 'foo';
    const datasourceFilters = ['name-of-uid1', 'name-of-uid2'];
    const sortOrder = SortOrder.Descending;
    const starred = true;
    const from = 100;
    const to = 200;
    const expectedLimit = 100;
    const expectedPage = 1;

    const items = await storage.getRichHistory({ search, datasourceFilters, sortOrder, starred, to, from });

    expect(getMock).toBeCalledWith(
      `/api/query-history?datasourceUid=uid1&datasourceUid=uid2&searchString=${search}&sort=time-desc&to=now-${from}d&from=now-${to}d&limit=${expectedLimit}&page=${expectedPage}&onlyStarred=${starred}`
    );
    expect(items).toMatchObject([expectedViewModel]);
  });
});
