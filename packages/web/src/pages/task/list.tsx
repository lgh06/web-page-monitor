import { NextPage } from "next/types";
import { ChangeEvent, useEffect, MouseEvent, useMemo } from 'react';
import { useImmerAtom } from 'jotai/immer';
import { createTaskDetailAtom, monacoEditorAtom, userInfoAtom } from '../../atoms';
import { CronTime } from '@webest/web-page-monitor-helper';
import { fetchAPI, useI18n, innerHTML } from "../../helpers/index";
import Link from "next/link";
import { ScriptList } from "../../components/scriptList";
import { useRouter } from "next/router";


const TaskListSimpPage: NextPage = () => {

  const [taskDetail, setTaskDetail] = useImmerAtom(createTaskDetailAtom);
  const [userInfo, setUserInfo] = useImmerAtom(userInfoAtom);
  const { t } = useI18n();
  const router = useRouter();

  // update input date when first entry
  async function firstInit() {
    let taskList: any = [];
    // TODO pagination
    taskList = await fetchAPI(`/market/script?userId=${userInfo._id}`) 
    setTaskDetail((v) => {
      if(taskList.length){
        v.taskList = taskList;
      }
    });
  }

  async function handleBtnDelete(ev: MouseEvent<HTMLButtonElement> ) {
    ev.preventDefault();
    let element = ev.target;
    let rowId = (element as any).dataset.rowId;
    let confirmed = confirm(t('Are you sure to delete this script') + '?');
    if(!confirmed){
      return;
    }
    let resp = await fetchAPI(`/task/delete_task?id=${rowId}`, null , 'DELETE')
    window.location.reload();
    return false;
  }

  useEffect(() => {
    firstInit();
  }, [router.query]);

  let meColumns = useMemo(() => [
    {
      Header: t('alias'),
      accessor: 'extra.alias',
    },
    {
      Header: t('URL'),
      accessor: 'pageURL',
    },
    {
      Header: t('Edit / Delete'),
      id: 'editOrView',
      Cell: ({ row: {original: or} }) => {
        return (<div style={{
          display: 'flex',
        }}>
          <Link href={'/task/edit_simp?id=' + or._id}>
            <a className='btn'>{t(`Edit`)}</a>
          </Link>
          <button data-row-id={or._id} onClick={handleBtnDelete} style={{marginLeft: '10px'}}>{t(`Delete`)}</button>
        </div>
        )
      }
    },
  ],[]);

  return (<>
    <main>
      <div>
        <Link href="/task/edit_simp">
          <a>{t('Back to create task simple mode')}</a>
        </Link>
        &nbsp;&nbsp;
        {
          taskDetail.taskList.length < 3 ? (
            <>
              <Link href={'/task/edit_simp'}>
                <a>{t(`Create a script`)}</a>
              </Link>&nbsp;&nbsp;&nbsp;&nbsp;
            </>
          ) : null
        }
      </div>
      <h3>
        {t(`Scripts created by you`)} :
      </h3>
      <section className='list'>
        <ScriptList
          columns={meColumns}
          data={taskDetail.taskList}
        ></ScriptList>
      </section>
    </main>
  </>);
}

export default TaskListSimpPage